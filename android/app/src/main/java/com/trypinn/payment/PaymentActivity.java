package com.trypinn.payment;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.widget.Toast;

import com.zarinpal.ewallets.purchase.OnCallbackVerificationPaymentListener;
import com.zarinpal.ewallets.purchase.PaymentRequest;
import com.zarinpal.ewallets.purchase.ZarinPal;

public class PaymentActivity extends AppCompatActivity {
    // private static final int PAYMENT_REQUEST_CODE = 467081;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_main);
        Uri data = getIntent().getData();
        ZarinPal.getPurchase(this).verificationPayment(data, new OnCallbackVerificationPaymentListener() {
            @Override
            public void onCallbackResultVerificationPayment(boolean isPaymentSuccess, String refID, PaymentRequest paymentRequest) {
                // Intent intent = getIntent();
                if (isPaymentSuccess) {
                    /* When Payment Request is Success */
                    String message = "پرداخت با موفقیت انجام شد، شماره رهگیری:" + refID;
                    // intent.putExtra("isPaymentSuccess", isPaymentSuccess);
                    // intent.putExtra("refID", refID);
                    // setResult(RESULT_OK, intent);
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
                } else {
                    /* When Payment Request is Failure */
                    String message = "پرداخت ناموفق";
                    // Intent intent = getIntent();
                    // intent.putExtra("isPaymentSuccess", isPaymentSuccess);
                    // setResult(RESULT_OK, intent);
                    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
                }
                finish();
                // finishActivity(PAYMENT_REQUEST_CODE);
                // getParent().finishActivity(PAYMENT_REQUEST_CODE);
                // finishActivityFromChild(, PAYMENT_REQUEST_CODE);
            }
        });
    }
}
