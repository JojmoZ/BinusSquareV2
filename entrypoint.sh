#!/usr/bin/expect -f
spawn npx drizzle-kit generate
expect eof

spawn npx drizzle-kit push
expect "No, abort"
send "\033[B"
expect "Yes, I want to execute all statements"
send "\r"
expect eof

exec npm run dev
