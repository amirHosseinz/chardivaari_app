package com.chardivaari_app.payment;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.zarinpal.ewallets.purchase.OnCallbackRequestPaymentListener;
import com.zarinpal.ewallets.purchase.OnCallbackVerificationPaymentListener;
import com.zarinpal.ewallets.purchase.PaymentRequest;
import com.zarinpal.ewallets.purchase.ZarinPal;

public class PaymentActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_main);
        Uri data = getIntent().getData();
        ZarinPal.getPurchase(this).verificationPayment(data, new OnCallbackVerificationPaymentListener() {
            @Override
            public void onCallbackResultVerificationPayment(boolean isPaymentSuccess, String refID, PaymentRequest paymentRequest) {
                if (isPaymentSuccess) {
                    /* When Payment Request is Success */
                    System.out.println("i am hereeeeeeee###################");
                    String message = "Your Payment is Success: " + refID;
                    System.out.println(message);
                    Intent intent = getIntent();
                    intent.putExtra("isPaymentSuccess", isPaymentSuccess);
                    intent.putExtra("refID", refID);
                    setResult(RESULT_OK, intent);
                    finish();
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
                } else {
                    /* When Payment Request is Failure */
                    String message = "Your Payment is Failure";
                    Intent intent = getIntent();
                    intent.putExtra("isPaymentSuccess", isPaymentSuccess);
                    setResult(RESULT_OK, intent);
                    finish();
                    System.out.println("payment is failure : ((((((( %%%%%%%%%%%%%%%");
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
