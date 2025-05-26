import { redirect, type ServerLoadEvent } from "@sveltejs/kit";

export function redirectIfAuthenticated(event: ServerLoadEvent) {
  if (event.locals.user) {
    throw redirect(302, "/home");
  }
}

export function redirectIfNotAuthenticated(event: ServerLoadEvent) {
  if (!event.locals.user) {
    throw redirect(302, "/login");
  }
}
export function redirectIfNotAdmin(event: ServerLoadEvent) {
  if (!event.locals.user || event.locals.user.username !== "admin") {
    throw redirect(302, "/home");
  }
}
