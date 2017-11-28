package com.trypinn;

import android.app.Application;
import android.content.Context;

import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.react.shell.MainPackageConfig;
import com.trypinn.payment.PaymentPackage;
import com.facebook.react.ReactApplication;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.centaurwarchief.smslistener.SmsListenerPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      Context context = getApplicationContext();
      ImagePipelineConfig frescoConfig = ImagePipelineConfig
              .newBuilder(context)
              .setBitmapMemoryCacheParamsSupplier(new CustomBitmapMemoryCacheParamsSupplier(context))
              .build();

      MainPackageConfig appConfig = new MainPackageConfig
              .Builder()
              .setFrescoConfig(frescoConfig)
              .build();

      return Arrays.<ReactPackage>asList(
          new MainReactPackage(appConfig),
          new GoogleAnalyticsBridgePackage(),
          new KCKeepAwakePackage(),
          new SmsListenerPackage(),
          new RNExitAppPackage(),
          new RNFSPackage(),
          new ImageResizerPackage(),
          new ImagePickerPackage(),
          new VectorIconsPackage(),
          new MapsPackage(),
          new PaymentPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
