package com.entroya.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());

            // Si es un error 404, redirigimos a index.html (la SPA)
            if (statusCode == 404) {
                return "forward:/index.html";
            }
        }
        // Para otros errores (500, 403, etc.) podrías devolver una vista genérica
        return "error"; // Opcional: podrías crear una página error.html en static
    }
}