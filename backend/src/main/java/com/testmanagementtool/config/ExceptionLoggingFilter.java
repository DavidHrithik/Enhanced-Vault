package com.testmanagementtool.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExceptionLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        } catch (Throwable t) {
            t.printStackTrace(); // Log to console/stderr for Render logs

            HttpServletResponse httpResponse = (HttpServletResponse) response;
            // Ensure we haven't already committed the response
            if (!httpResponse.isCommitted()) {
                httpResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write(String.format(
                        "{\"error\": \"Critical Filter Error\", \"message\": \"%s\", \"type\": \"%s\"}",
                        t.getMessage().replace("\"", "'"), // Simple escape
                        t.getClass().getName()));
            }
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
