import smtplib
from email.message import EmailMessage



from app.core.config import settings




def send_order_status_email(
    customer_email: str,
    customer_name: str,
    order_id: str,
    order_status: str,
):
    if not customer_email:
        return


    subject_map = {
        "confirmed": "Your NexoraMart order has been confirmed",
        "shipped": "Your NexoraMart order has been shipped",
        "delivered": "Your NexoraMart order has been delivered",
        "cancelled": "Your NexoraMart order has been cancelled",
    }


    heading_map = {
        "confirmed": "Order Confirmed",
        "shipped": "Order Shipped",
        "delivered": "Order Delivered",
        "cancelled": "Order Cancelled",
    }


    message_map = {
        "confirmed": (
            "Good news! Your order has been confirmed "
            "and is now being prepared."
        ),
        "shipped": (
            "Your order has been shipped and is on its way."
        ),
        "delivered": (
            "Your order has been delivered. "
            "Thank you for shopping with NexoraMart."
        ),
        "cancelled": (
            "Your order has been cancelled. "
            "If you did not request this cancellation, "
            "please contact our support team."
        ),
    }


    status_colors = {
        "confirmed": "#2563eb",
        "shipped": "#7c3aed",
        "delivered": "#059669",
        "cancelled": "#dc2626",
    }


    subject = subject_map.get(
        order_status,
        "Update about your NexoraMart order",
    )


    heading = heading_map.get(
        order_status,
        "Order Update",
    )


    message = message_map.get(
        order_status,
        "Your order status has been updated.",
    )


    status_color = status_colors.get(
        order_status,
        "#64748b",
    )


    frontend_url = getattr(
        settings,
        "frontend_url",
        "http://localhost:5173",
    )


    track_order_url = (
        f"{frontend_url}/track-order?order_id={order_id}"
    )


    plain_text_content = f"""
Hello {customer_name},


{message}


Order ID: {order_id}
Current Status: {order_status.upper()}


Track your order:
{track_order_url}


Thank you,
NexoraMart Team
"""


    html_content = f"""
<!DOCTYPE html>
<html>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        background-color: #f1f5f9;
        padding: 32px 16px;
      "
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 620px;
              background-color: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
            "
          >
            <tr>
              <td
                style="
                  background: linear-gradient(
                    135deg,
                    #4f46e5,
                    #a21caf,
                    #db2777
                  );
                  padding: 36px 32px;
                  text-align: center;
                "
              >
                <div
                  style="
                    display: inline-block;
                    width: 56px;
                    height: 56px;
                    line-height: 56px;
                    border-radius: 16px;
                    background-color: rgba(255, 255, 255, 0.18);
                    color: #ffffff;
                    font-size: 26px;
                    font-weight: 900;
                  "
                >
                  N
                </div>


                <h1
                  style="
                    margin: 18px 0 0;
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: -0.5px;
                  "
                >
                  NexoraMart
                </h1>


                <p
                  style="
                    margin: 8px 0 0;
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 14px;
                  "
                >
                  Order Status Update
                </p>
              </td>
            </tr>


            <tr>
              <td style="padding: 36px 32px 8px;">
                <h2
                  style="
                    margin: 0;
                    color: #0f172a;
                    font-size: 24px;
                    font-weight: 800;
                  "
                >
                  Hello {customer_name},
                </h2>


                <p
                  style="
                    margin: 14px 0 0;
                    color: #475569;
                    font-size: 16px;
                    line-height: 1.6;
                  "
                >
                  {message}
                </p>
              </td>
            </tr>


            <tr>
              <td style="padding: 24px 32px;">
                <div
                  style="
                    border: 1px solid #e2e8f0;
                    border-radius: 18px;
                    padding: 24px;
                    background-color: #f8fafc;
                  "
                >
                  <p
                    style="
                      margin: 0 0 8px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                    "
                  >
                    Order ID
                  </p>


                  <p
                    style="
                      margin: 0 0 20px;
                      color: #0f172a;
                      font-family: monospace;
                      font-size: 18px;
                      font-weight: 700;
                      word-break: break-all;
                    "
                  >
                    {order_id}
                  </p>


                  <p
                    style="
                      margin: 0 0 8px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                    "
                  >
                    Current Status
                  </p>


                  <span
                    style="
                      display: inline-block;
                      padding: 8px 16px;
                      border-radius: 999px;
                      background-color: {status_color};
                      color: #ffffff;
                      font-size: 13px;
                      font-weight: 800;
                      letter-spacing: 0.5px;
                      text-transform: uppercase;
                    "
                  >
                    {order_status.upper()}
                  </span>
                </div>
              </td>
            </tr>


            <tr>
              <td style="padding: 8px 32px 32px;">
                <a
                  href="{track_order_url}"
                  style="
                    display: block;
                    padding: 16px 24px;
                    border-radius: 14px;
                    background-color: #4f46e5;
                    color: #ffffff;
                    font-size: 16px;
                    font-weight: 700;
                    text-align: center;
                    text-decoration: none;
                  "
                >
                  Track Your Order
                </a>


                <p
                  style="
                    margin: 18px 0 0;
                    color: #94a3b8;
                    font-size: 13px;
                    line-height: 1.6;
                    text-align: center;
                  "
                >
                  If the button does not work, copy this link into
                  your browser:
                  <br />
                  <span style="color: #4f46e5;">
                    {track_order_url}
                  </span>
                </p>
              </td>
            </tr>


            <tr>
              <td
                style="
                  padding: 24px 32px;
                  border-top: 1px solid #e2e8f0;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #64748b;
                    font-size: 13px;
                  "
                >
                  Thank you for shopping with NexoraMart.
                </p>


                <p
                  style="
                    margin: 6px 0 0;
                    color: #94a3b8;
                    font-size: 12px;
                  "
                >
                  This is an automated order-status notification.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


    email = EmailMessage()


    email["From"] = settings.smtp_sender_email
    email["To"] = customer_email
    email["Subject"] = subject


    email.set_content(plain_text_content)


    email.add_alternative(
        html_content,
        subtype="html",
    )


    with smtplib.SMTP(
        settings.smtp_host,
        settings.smtp_port,
    ) as server:
        server.starttls()
        server.login(
            settings.smtp_sender_email,
            settings.smtp_email_password,
        )
        server.send_message(email)