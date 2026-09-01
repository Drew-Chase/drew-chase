set windows-shell := ["powershell.exe", "-NoProfile", "-NoLogo", "-Command"]
set shell := ["bash", "-c"]

@default:
    @just --list

install:
    @pnpm i

dev: install
    @pnpm dev

build: install
    @pnpm build

preview: install
    @pnpm preview
