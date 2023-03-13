import nodemailer from 'nodemailer';
import { EmailDTO } from '../types/Iemail.type';
import { Logger } from '../utils/logger/winston.logger';

const formMail = (title_voucher: string, value_voucher: string): string => {
    return `<div width="100% " style="margin:0; background-color: #f0f2f3">
  <div div style = "margin:auto;max-width:600px;padding-top:50px" class="m_1760158292747020864email-container" >
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="m_1760158292747020864logoContainer" style="background:#252f3d;border-radius:3px 3px 0 0;max-width:600px">
        <tbody><tr>
            <td style="background:#252f3d;border-radius:3px 3px 0 0;padding:20px 0 10px 0;text-align:center">
                <img src="https://nodemailer.com/nm_logo_200x136.png" width="75" height="45" alt="AWS logo" border="0" style="font-family:sans-serif;font-size:15px;line-height:140%;color:#555555" class="CToWUd" data-bit="iit">
            </td>
        </tr>
    </tbody></table>
    
    
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="m_1760158292747020864emailBodyContainer" style="border:0px;border-bottom:1px solid #d6d6d6;max-width:600px">
        <tbody><tr>
            <td style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                <h1 style="font-size:20px;font-weight:bold;line-height:1.3;margin:0 0 15px 0">${title_voucher}</h1>
                <p style="margin:0;padding:0">Thank you for starting the voting creation process. We want to make sure it's really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.</p>
                <p style="margin:0;padding:0"></p>
            </td>
        </tr>
        <tr>
            <td style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px;padding-top:0;text-align:center">
                <div style="font-weight:bold;padding-bottom:15px">You have registered with account</div>
                <div style="color:#000;font-size:12px;font-weight:bold;padding-bottom:15px">${value_voucher}</div>
                <div>Find the right solution for your enterprise</div>
            </td>
        </tr>
        <tr>
            <td style="background-color:#fff;border-top:1px solid #e0e0e0;color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                <p style="margin:0 0 15px 0;padding:0 0 0 0">We were looking for a simple yet secure online solution and that's how we came to Polys. After several trial sessions, we decided to use the system for our online elections and were pleased with the results</p>
            </td>
        </tr>
    </tbody></table>
    
    
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center" id="m_1760158292747020864footer" style="max-width:600px">
        <tbody><tr>
            <td style="color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:12px;line-height:16px;padding:20px 30px;text-align:center">
                Thông báo này được tạo và phân phối bởi Amazon Web Services, Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web Services, Inc. Mọi quyền được bảo lưu. AWS là thương hiệu đã đăng ký của <a href="https://bjdxkhre.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.amazon.com%2F/1/01000184c2bc1c91-6836e475-fc01-4a74-8348-081d2d5e3e70-000000/QJnfL2HeDG2roVlSbJHoyQK-sac=298" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://bjdxkhre.r.us-east-1.awstrack.me/L0/https:%252F%252Fwww.amazon.com%252F/1/01000184c2bc1c91-6836e475-fc01-4a74-8348-081d2d5e3e70-000000/QJnfL2HeDG2roVlSbJHoyQK-sac%3D298&amp;source=gmail&amp;ust=1669800828376000&amp;usg=AOvVaw2dcvm-42UMNvOy87vb9ARV">Amazon.com</a>, Inc. Xem <a href="https://bjdxkhre.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.amazon.com%2Fgp%2Ff.html%3FC=ASNZCWDUG167%26M=urn:rtn:msg:20201117075724eb4b304704de4791b90718772250p0na%26R=24F5VU3RW0OAG%26T=C%26U=https%253A%252F%252Faws.amazon.com%252Fprivacy%252F%253Fsc_channel%253Dem%2526sc_campaign%253Dwlcm%2526sc_publisher%253Daws%2526sc_medium%253Dem_wlcm_footer%2526sc_detail%253Dwlcm_footer%2526sc_content%253Dother%2526sc_country%253Dglobal%2526sc_geo%253Dglobal%2526sc_category%253Dmult%2526ref_%253Dpe_1679150_261538020%26H=PSTTW2QUTETQPANYMBJB5CSZMMSA%26ref_=pe_1679150_261538020/1/01000184c2bc1c91-6836e475-fc01-4a74-8348-081d2d5e3e70-000000/-kl3Utc_OXBmbRX9GRo2ZKZGcHY=298" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://bjdxkhre.r.us-east-1.awstrack.me/L0/https:%252F%252Fwww.amazon.com%252Fgp%252Ff.html%253FC%3DASNZCWDUG167%2526M%3Durn:rtn:msg:20201117075724eb4b304704de4791b90718772250p0na%2526R%3D24F5VU3RW0OAG%2526T%3DC%2526U%3Dhttps%25253A%25252F%25252Faws.amazon.com%25252Fprivacy%25252F%25253Fsc_channel%25253Dem%252526sc_campaign%25253Dwlcm%252526sc_publisher%25253Daws%252526sc_medium%25253Dem_wlcm_footer%252526sc_detail%25253Dwlcm_footer%252526sc_content%25253Dother%252526sc_country%25253Dglobal%252526sc_geo%25253Dglobal%252526sc_category%25253Dmult%252526ref_%25253Dpe_1679150_261538020%2526H%3DPSTTW2QUTETQPANYMBJB5CSZMMSA%2526ref_%3Dpe_1679150_261538020/1/01000184c2bc1c91-6836e475-fc01-4a74-8348-081d2d5e3e70-000000/-kl3Utc_OXBmbRX9GRo2ZKZGcHY%3D298&amp;source=gmail&amp;ust=1669800828376000&amp;usg=AOvVaw3Gv6K9aRb7sFuXlNOdljte">chính sách quyền riêng tư</a> của chúng tôi.
            </td>
        </tr>
    </tbody></table>
    
    
</div >
  <img alt="" src="https://ci3.googleusercontent.com/proxy/7G6E3C2fvmTRxUtvSfkZw-AasAumspBb5snsuWpW0uP-8l9JAWU5CGM3uypgsItTYa4mWxzIg03dhYpUR_IOB9-5a-8Q7jAD3H-gkvyA1AavU6Y5mfnETLtGc8KzM1g6Noo433DvaGnd83hBYu4BoofAjkzXQRXlBbBTETCvPRWmTsX_ZkkuKBuKZWEKL0mlYjh3zJyKxWEiD7Lb=s0-d-e1-ft#https://bjdxkhre.r.us-east-1.awstrack.me/I0/01000184c2bc1c91-6836e475-fc01-4a74-8348-081d2d5e3e70-000000/b6TxBqMs1swAitD9L0RRe9zSsxE=298" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:W2ZhbHNlLDJd"><div class="yj6qo"></div><div class="adL">
  </div>
  </div>`;
};

export const sendEmail = async (data: EmailDTO) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: data.from, // sender address
        to: data.to, // list of receivers
        subject: data.subject, //
        html: formMail(data.title, data.content), // html body
    });

    // Preview only available when sending through an Ethereal account
    Logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
