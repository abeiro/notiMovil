#!/bin/bash

MANIFEST=./platforms/android/AndroidManifest.xml

grep -q pathPattern $MANIFEST && { print "Manifest already modified. Nothing to do."; exit 0; }

AFTER_LINE='android:name="MainActivity"'
ADDITION='\
  <intent-filter android:label="@string/launcher_name">\
    <action android:name="android.intent.action.VIEW"></action>\
    <category android:name="android.intent.category.DEFAULT"></category>\
    <category android:name="android.intent.category.BROWSABLE"></category>\
  </intent-filter>
';

sed -i -e "/${AFTER_LINE}/a${ADDITION}" $MANIFEST
