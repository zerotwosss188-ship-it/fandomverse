@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   FandomVerse - Merchandise Image Renamer
echo ============================================
echo.

REM ---------- ANIME ----------
call :rename "public\images\merchandise\anime" "Attack on Titan" "levi"
call :rename "public\images\merchandise\anime" "Bleach" "ichigo"
call :rename "public\images\merchandise\anime" "demon slayer" "tanjiro"
call :rename "public\images\merchandise\anime" "Dragon Ball" "goku"
call :rename "public\images\merchandise\anime" "Jujutsu Kaisen" "gojo"
call :rename "public\images\merchandise\anime" "Naruto" "naruto"
call :rename "public\images\merchandise\anime" "One Piece" "luffy"
call :rename "public\images\merchandise\anime" "Solo Leveling" "jinwoo"

REM ---------- GAMING ----------
call :rename "public\images\merchandise\gaming" "God of War replica" "leviathan-axe"
call :rename "public\images\merchandise\gaming" "God of War" "kratos"
call :rename "public\images\merchandise\gaming" "The Legend of Zelda replica" "master-sword"
call :rename "public\images\merchandise\gaming" "The Legend of Zelda" "link"
call :rename "public\images\merchandise\gaming" "The Witcher accessory" "wolf-medallion"
call :rename "public\images\merchandise\gaming" "The Witcher" "geralt"
call :rename "public\images\merchandise\gaming" "Halo" "master-chief"
call :rename "public\images\merchandise\gaming" "Red Dead Redemption" "arthur-morgan"

REM ---------- KPOP ----------
call :rename "public\images\merchandise\kpop" "BTS" "bts-lightstick"
call :rename "public\images\merchandise\kpop" "BLACKPINK" "blackpink-album"
call :rename "public\images\merchandise\kpop" "Stray Kids Album" "stray-kids-album"
call :rename "public\images\merchandise\kpop" "TWICE" "twice-candybong"
call :rename "public\images\merchandise\kpop" "SEVENTEEN" "seventeen-caratbong"
call :rename "public\images\merchandise\kpop" "Newjeans" "newjeans-album"
call :rename "public\images\merchandise\kpop" "IVE" "ive-poster"
call :rename "public\images\merchandise\kpop" "aespa" "aespa-figure"

REM ---------- MANGA ----------
call :rename "public\images\merchandise\manga" "Demon Slayer" "demon-slayer"
call :rename "public\images\merchandise\manga" "Jujutsu" "jjk"
call :rename "public\images\merchandise\manga" "Naruto" "naruto"
call :rename "public\images\merchandise\manga" "One Piece" "one-piece"
call :rename "public\images\merchandise\manga" "Attack on Titan" "aot"
call :rename "public\images\merchandise\manga" "Berserk" "berserk"
call :rename "public\images\merchandise\manga" "Chainsaw Man" "chainsaw-man"
call :rename "public\images\merchandise\manga" "Death Note" "death-note"

REM ---------- MOVIE (folder singular "movie") ----------
call :rename "public\images\merchandise\movie" "dune Replica" "crysknife"
call :rename "public\images\merchandise\movie" "Dune" "dune-artbook"
call :rename "public\images\merchandise\movie" "the matrix Collectible" "red-blue-pill"
call :rename "public\images\merchandise\movie" "The Matrix" "matrix-poster"
call :rename "public\images\merchandise\movie" "Iron Man" "arc-reactor"
call :rename "public\images\merchandise\movie" "Alien" "xenomorph"
call :rename "public\images\merchandise\movie" "Pirates of the Caribbean" "jack-compass"

REM ---------- TV-SHOWS ----------
call :rename "public\images\merchandise\tv-shows" "Game of Throne FIGURE" "iron-throne"
call :rename "public\images\merchandise\tv-shows" "Game of Thrones" "got-map"
call :rename "public\images\merchandise\tv-shows" "Stranger Things FIGURE" "demogorgon"
call :rename "public\images\merchandise\tv-shows" "STRANGER THINGS" "hellfire-tee"
call :rename "public\images\merchandise\tv-shows" "Sherlock ACCESSORY" "221b-sign"
call :rename "public\images\merchandise\tv-shows" "The Office accessory" "dunder-mifflin"
call :rename "public\images\merchandise\tv-shows" "The Office apparel" "schrute-farms"
call :rename "public\images\merchandise\tv-shows" "Breaking Bad" "los-pollos"

REM ---------- COMICS ----------
call :rename "public\images\merchandise\comics" "Captain America" "cap-shield"
call :rename "public\images\merchandise\comics" "Spider-Man" "spiderman-comic"
call :rename "public\images\merchandise\comics" "Avengers" "avengers-poster"
call :rename "public\images\merchandise\comics" "X-Men" "wolverine-claws"
call :rename "public\images\merchandise\comics" "Thor" "mjolnir"
call :rename "public\images\merchandise\comics" "DC" "batman-statue"

echo.
echo ============================================
echo   DONE! Press any key to exit...
echo ============================================
pause >nul
goto :eof

REM ============================================
:rename
set "FOLDER=%~1"
set "OLDNAME=%~2"
set "NEWNAME=%~3"

if exist "%FOLDER%\%NEWNAME%.png" (
  echo   [SKIP] %NEWNAME%.png already exists
  goto :eof
)

if exist "%FOLDER%\%OLDNAME%.jpg" (
  ren "%FOLDER%\%OLDNAME%.jpg" "%NEWNAME%.png"
  if errorlevel 1 (
    echo   [FAIL] %OLDNAME%.jpg
  ) else (
    echo   [ OK ] %OLDNAME%.jpg  -^>  %NEWNAME%.png
  )
  goto :eof
)

if exist "%FOLDER%\%OLDNAME%.jpeg" (
  ren "%FOLDER%\%OLDNAME%.jpeg" "%NEWNAME%.png"
  echo   [ OK ] %OLDNAME%.jpeg  -^>  %NEWNAME%.png
  goto :eof
)

if exist "%FOLDER%\%OLDNAME%.png" (
  echo   [SKIP] %OLDNAME%.png already exists
  goto :eof
)

if exist "%FOLDER%\%OLDNAME%.webp" (
  ren "%FOLDER%\%OLDNAME%.webp" "%NEWNAME%.png"
  echo   [ OK ] %OLDNAME%.webp  -^>  %NEWNAME%.png
  goto :eof
)

echo   [MISS] %OLDNAME%  - not found
goto :eof