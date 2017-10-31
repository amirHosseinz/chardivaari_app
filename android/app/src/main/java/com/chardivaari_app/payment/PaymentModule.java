package com.chardivaari_app.payment;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.api.BooleanResult;
import com.zarinpal.ewallets.purchase.OnCallbackRequestPaymentListener;
import com.zarinpal.ewallets.purchase.PaymentRequest;
import com.zarinpal.ewallets.purchase.ZarinPal;

public class PaymentModule extends ReactContextBaseJavaModule {
    private static final int PAYMENT_REQUEST_CODE = 467081;
    private Promise paymentPromise;
    private static final String E_PAYMENT_CANCELLED = "E_PAYMENT_CANCELLED";
    private static final String E_NO_PAYMENT_DATA_FOUND = "E_NO_PAYMENT_DATA_FOUND";
    private static final String E_PAYMENT_FAILED = "E_PAYMENT_FAILED";

    private final ActivityEventListener myActivityListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == PAYMENT_REQUEST_CODE) {
                if (paymentPromise != null) {
//                    if (resultCode == Activity.RESULT_CANCELED) {
//                        System.out.println("chera cancel akhe?! $$$$$$$$$");
//                        paymentPromise.reject(E_PAYMENT_CANCELLED, "Payment was cancelled");
//                    }
                    if (resultCode == Activity.RESULT_OK) {
                        System.out.println("Activity.result is ok &&&&&&&&");
                        Uri uri = intent.getData();
                        if (uri == null) {
                            paymentPromise.reject(E_NO_PAYMENT_DATA_FOUND, "No payment data found");
                        } else {
                            paymentPromise.resolve(uri.toString());
                        }
                    }
                    // paymentPromise = null;
                }
            }
        }
    };

    public PaymentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(myActivityListener);
    }

    @Override
    public String getName() {
        return "PaymentModule";
    }

    @ReactMethod
    public void reactRequestPayment(String description, int amount, Promise paymentPromise) {
        this.paymentPromise = paymentPromise;
        try {
            ZarinPal purchase = ZarinPal.getPurchase(getReactApplicationContext());
            PaymentRequest payment = ZarinPal.getPaymentRequest();
            payment.setMerchantID("bd3e115a-b955-11e7-b416-005056a205be");
            payment.setAmount(amount);
            payment.setDescription(description);
            payment.setCallbackURL("myapp://zarinpalpayment");
            // payment.setMobile("09124642386");
            // payment.setEmail("amirhossein.zarezadeh@gmail.com");
            purchase.startPayment(payment, new OnCallbackRequestPaymentListener() {
                @Override
                public void onCallbackResultPaymentRequest(int status, String authority, Uri paymentGatewayUri, Intent intent) {
                    if (status == 100) {
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        getCurrentActivity().startActivityForResult(intent, PAYMENT_REQUEST_CODE);
                    } else {
                        Toast.makeText(getReactApplicationContext(), "Your Payment Failure before payment uri", Toast.LENGTH_LONG).show();
                    }
                }
            });
        } catch (Exception e) {
            System.out.println("failed akhe?! **********");
            paymentPromise.reject(E_PAYMENT_FAILED, e);
            this.paymentPromise = null;
        }
    }
}
