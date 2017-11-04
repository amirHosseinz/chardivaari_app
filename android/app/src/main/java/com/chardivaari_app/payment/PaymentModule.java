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

import org.json.JSONException;

import java.io.IOException;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.util.HashMap;
import java.util.Map;

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
                System.out.println("in prev. Activity ");
                if (paymentPromise != null) {
                    System.out.println("promis is not null");
                    if (resultCode == Activity.RESULT_CANCELED) {
                        System.out.println("chera cancel $$$$$$$$$");
                        paymentPromise.reject(E_PAYMENT_CANCELLED, "Payment was cancelled");
                    }
                    if (resultCode == Activity.RESULT_OK) {
                        System.out.println("Activity.result is ok &&&&&&&&");
                        Uri uri = intent.getData();
                        if (uri == null) {
                            paymentPromise.reject(E_NO_PAYMENT_DATA_FOUND, "No payment data found");
                        } else {
                            Map<String, Object> results = new HashMap<>();
                            boolean isSuccessful = intent.getBooleanExtra("isPaymentSuccess", false);
                            results.put("isPaymentSuccess", isSuccessful);
                            if (isSuccessful) {
                                String refID = intent.getStringExtra("refID");
                                results.put("refID", refID);
                            } else {
                                results.put("refID", null);
                            }
                            paymentPromise.resolve(results);
                        }
                    }
                    paymentPromise = null;
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
            final PaymentRequest payment = ZarinPal.getPaymentRequest();
            payment.setMerchantID("bd3e115a-b955-11e7-b416-005056a205be");
            payment.setAmount(amount);
            payment.setDescription(description);
            payment.setCallbackURL("https://www.trypinn.com/api/request/verify_pay/");
            // payment.setMobile("09124642386");
            // payment.setEmail("amirhossein.zarezadeh@gmail.com");
            purchase.startPayment(payment, new OnCallbackRequestPaymentListener() {
                @Override
                public void onCallbackResultPaymentRequest(int status, String authority, Uri paymentGatewayUri, Intent intent) {
                    if (status == 100) {
                        // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        // FLAG_ACTIVITY_CLEAR_TASK
                        // intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        OkHttpClient client = new OkHttpClient();

                        System.out.println("this is payment: ############");
                        System.out.println(payment.getAmount());
                        System.out.println(payment.getAuthority());
                        try {
                            System.out.println("request as json:");
                            System.out.println(payment.getPaymentRequestAsJson());
                        } catch (JSONException e) {
                            System.out.println(e);
                        }
                        getCurrentActivity().startActivityForResult(intent, PAYMENT_REQUEST_CODE);
                        // getCurrentActivity().startActivity(intent);
                    } else {
                        Toast.makeText(getReactApplicationContext(), "Your Payment Failure before payment uri", Toast.LENGTH_LONG).show();
                    }
                }
            });
        } catch (Exception e) {
            System.out.println("failed **********");
            paymentPromise.reject(E_PAYMENT_FAILED, e);
            this.paymentPromise = null;
        }
    }
}
