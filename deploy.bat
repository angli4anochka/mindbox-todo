@echo off
echo Starting GitHub Pages deployment...

REM Build the app
npm run build

REM Create gh-pages branch if it doesn't exist
git show-ref --verify --quiet refs/heads/gh-pages
if errorlevel 1 (
    git checkout --orphan gh-pages
    git rm -rf .
) else (
    git checkout gh-pages
    git rm -rf . --ignore-unmatch
)

REM Copy build files
xcopy build\* . /E /Y
copy build\index.html index.html /Y

REM Commit and push
git add .
git commit -m "Deploy to GitHub Pages - %date% %time%"
git push origin gh-pages

REM Return to main branch
git checkout master

echo Deployment complete!
echo Your app will be available at: https://yourusername.github.io/mindbox-todo