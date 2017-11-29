package com.trypinn.payment;

import android.app.Activity;
import android.net.Proxy;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.webkit.CookieManager;
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
import com.franmontiel.persistentcookiejar.PersistentCookieJar;
import com.google.android.gms.common.api.BooleanResult;
import com.zarinpal.ewallets.purchase.OnCallbackRequestPaymentListener;
import com.zarinpal.ewallets.purchase.PaymentRequest;
import com.zarinpal.ewallets.purchase.ZarinPal;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.CookieJar;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Headers;
import okhttp3.Response;

import com.franmontiel.persistentcookiejar.cache.SetCookieCache;
import com.franmontiel.persistentcookiejar.persistence.SharedPrefsCookiePersistor;

import java.util.HashMap;
import java.util.Map;

public class PaymentModule extends ReactContextBaseJavaModule {
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    CookieJar cookieJar =
            new PersistentCookieJar(new SetCookieCache(), new SharedPrefsCookiePersistor(getReactApplicationContext()));
    OkHttpClient client = new OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .proxy(java.net.Proxy.NO_PROXY).build();
    Call post(String url, String json, Map<String, String> header, Callback callback) {
        Headers headerBuild = Headers.of(header);
        RequestBody body = RequestBody.create(JSON, json);
        Request request = new Request.Builder()
                .url(url)
                .headers(headerBuild)
                .post(body)
                .build();
        Call call = client.newCall(request);
        call.enqueue(callback);
        return call;
    }

    private static final int PAYMENT_REQUEST_CODE = 467081;
    private Promise paymentPromise;
    private static final String E_PAYMENT_CANCELLED = "E_PAYMENT_CANCELLED";
    private static final String E_NO_PAYMENT_DATA_FOUND = "E_NO_PAYMENT_DATA_FOUND";
    private static final String E_PAYMENT_FAILED = "E_PAYMENT_FAILED";

    private final ActivityEventListener myActivityListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == PAYMENT_REQUEST_CODE) {
                // System.out.println("in prev. Activity ");
                if (paymentPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        paymentPromise.reject(E_PAYMENT_CANCELLED, "Payment was cancelled");
                    }
                    if (resultCode == Activity.RESULT_OK) {
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
    public void reactRequestPayment(String description, int amount, final String token, final int requestId, Promise paymentPromise) {
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
                public void onCallbackResultPaymentRequest(int status, String authority, Uri paymentGatewayUri, final Intent intent) {
                    if (status == 100) {
                        // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        // FLAG_ACTIVITY_CLEAR_TASK
                        // intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        String requestBody = "{ \"token\": \"" + token + "\", ";
                        requestBody = requestBody + "\"request_id\": \"" + requestId + "\", ";
                        requestBody = requestBody + "\"amount\": \"" + payment.getAmount() + "\", ";
                        requestBody = requestBody + "\"authority\": \"" + payment.getAuthority() + "\" }";
                        // System.out.println(requestBody);

                        Map<String, String> header = new HashMap<>();
                        header.put("Accept", "application/json");
                        header.put("Content-Type", "application/json");
                        header.put("Authorization", "Token "+token);

                        post("https://www.trypinn.com/api/payment_request/", requestBody, header, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                                // System.out.println("in onFailure");
                                // System.out.println();
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                if (response.isSuccessful()) {
                                    // System.out.println("response.body().string()");
                                    // System.out.println(response.body().string());
                                    if (response.code() == 200) {
                                        // getCurrentActivity().startActivityForResult(intent, PAYMENT_REQUEST_CODE);
                                        getCurrentActivity().startActivity(intent);
                                    }
                                } else {
                                    // System.out.println("in onResponse");
                                    // System.out.println(response.body().string());
                                    // System.out.println(response.code());
                                }
                            }
                        });
                    } else {
                        Toast.makeText(getReactApplicationContext(), "خطا در انجام پرداخت", Toast.LENGTH_LONG).show();
                    }
                }
            });
        } catch (Exception e) {
            // System.out.println("failed **********");
            paymentPromise.reject(E_PAYMENT_FAILED, e);
            this.paymentPromise = null;
        }
    }

    @ReactMethod
    public void reactReserveRefund(String description, int amount, final String token, final int reserveId, Promise paymentPromise) {
        this.paymentPromise = paymentPromise;
        try {
            ZarinPal purchase = ZarinPal.getPurchase(getReactApplicationContext());
            final PaymentRequest payment = ZarinPal.getPaymentRequest();
            payment.setMerchantID("bd3e115a-b955-11e7-b416-005056a205be");
            payment.setAmount(amount);
            payment.setDescription(description);
            payment.setCallbackURL("https://www.trypinn.com/api/reserve/verify_refund/");
            purchase.startPayment(payment, new OnCallbackRequestPaymentListener() {
                @Override
                public void onCallbackResultPaymentRequest(int status, String authority, Uri paymentGatewayUri, final Intent intent) {
                    if (status == 100) {
                        String requestBody = "{ \"token\": \"" + token + "\", ";
                        requestBody = requestBody + "\"reserve_id\": \"" + reserveId + "\", ";
                        requestBody = requestBody + "\"amount\": \"" + payment.getAmount() + "\", ";
                        requestBody = requestBody + "\"authority\": \"" + payment.getAuthority() + "\" }";

                        Map<String, String> header = new HashMap<>();
                        header.put("Accept", "application/json");
                        header.put("Content-Type", "application/json");
                        header.put("Authorization", "Token "+token);

                        post("https://www.trypinn.com/api/refund_reserve/", requestBody, header, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                if (response.isSuccessful()) {
                                    if (response.code() == 200) {
                                        getCurrentActivity().startActivity(intent);
                                    }
                                } else {
                                }
                            }
                        });
                    } else {
                        Toast.makeText(getReactApplicationContext(), "خطا در انجام پرداخت", Toast.LENGTH_LONG).show();
                    }
                }
            });
        } catch (Exception e) {
            paymentPromise.reject(E_PAYMENT_FAILED, e);
            this.paymentPromise = null;
        }
    }

}
