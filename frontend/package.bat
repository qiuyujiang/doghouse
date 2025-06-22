@echo off

rem ======================================================================
rem npm install
rem npm run build
rem author: qiuyujiang
rem date: 2020-03-02
rem ======================================================================
echo '================================execute npm================================'
call npm install
call npm run build:production

echo '================================execute ficus-panel-web-custom-jd static file copy================================'
del /f /s /q ..\src\main\resources\static\*.*
rd /s /q ..\src\main\resources\static\static\
WScript.sleep 5000
xcopy dist ..\src\main\resources\static /s /e /y

echo '================================success================================'
@cmd