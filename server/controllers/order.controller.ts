import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import NotificationModel from "../models/notification.model";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import { newOrder } from "../services/order.service";
import ErrorHandler from "../utils/errorHandler";
import sendMail from "../utils/sendEmail";

// criar ordem de compra
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      // se o usúario já tiver o curso
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (courseExistInUser) {
        return next(
          new ErrorHandler("Você já comprou este curso anteriormente", 400)
        );
      }
      // verificar se o curso existe
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Curso não encontrado", 400));
      }
      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      // crie novo pedido
      newOrder(data, res, next);

      // enviar email
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../emails/order-confirmation.ejs"),
        { order: mailData }
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Confirmação de compra",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
      // depois de fazer o pedido, atualizar os cursos do usúario
      user?.courses.push(course._id);
      await user?.save();

      // criar notificação de compra para o admin
      await NotificationModel.create({
        user: user?._id,
        title: "Novo Pedido",
        message: `Você tem um novo pedido no curso ${course?.name}`,
      });

      //atualizar as compras do curso
      course.purchased ? (course.purchased += 1) : course.purchased;
      await course.save();

      // realizar o pedido
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
