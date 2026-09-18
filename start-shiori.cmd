@echo off
rem One click: starts your own Shiori (settings, extensions and password live in seanime\dev-datadir) and opens it.
title Shiori
curl -s -o nul -m 2 http://127.0.0.1:43000/ && (
  echo Shiori is already running.
  start "" http://localhost:43000
  exit /b
)
echo Starting Shiori on http://localhost:43000 . Close this window to stop it.
start "" http://localhost:43000
"%~dp0seanime\seanime-shiori.exe" --datadir "%~dp0seanime\dev-datadir"
