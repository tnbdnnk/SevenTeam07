import nodemailer from 'nodemailer';
import 'dotenv/config';
import sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY, UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = data => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};

export const sendHelpEmail = data => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  return sgMail.send(data)
    .then(() => {
      console.log('Email відправлено');
    })
    .catch(error => {
      console.error(error);
    });
};
