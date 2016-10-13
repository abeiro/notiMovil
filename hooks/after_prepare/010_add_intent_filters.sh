#!/bin/bash

if [ -d ./platforms/android/ ]; 
	then echo "Platform android detected";
else 
	exit 0;
fi

if (grep crsurn ./platforms/android/AndroidManifest.xml&>/dev/null)
then
	exit 0
fi
MANIFEST=./platforms/android/AndroidManifest.xml

grep -q pathPattern $MANIFEST && { print "Manifest already modified. Nothing to do."; exit 0; }

AFTER_LINE='android:name="MainActivity"'
ADDITION='\
  <intent-filter android:label="@string/launcher_name">\
    <action android:name="android.intent.action.VIEW"></action>\
    <category android:name="android.intent.category.DEFAULT"></category>\
    <category android:name="android.intent.category.BROWSABLE"></category>\
  </intent-filter>\
  <intent-filter>\
  <action android:name="android.intent.action.SEND" />\
  <action android:name="android.intent.action.SEND_MULTIPLE" />\
  <category android:name="android.intent.category.DEFAULT" />\
  <data android:scheme="crsurn" />\
   </intent-filter>
';

sed -i -e "/${AFTER_LINE}/a${ADDITION}" $MANIFEST
 
