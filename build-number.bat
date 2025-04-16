@echo off
setlocal enabledelayedexpansion

REM Define the file path
set inputFile=.\.env.version

REM Read the current build number from the file
for /f "tokens=2 delims==" %%a in (%inputFile%) do (
    set buildNumber=%%a
)

REM Increment the build number
set /a buildNumber+=1

REM Write the updated build number back to the file
echo BUILD_NUMBER=!buildNumber! > %inputFile%

endlocal