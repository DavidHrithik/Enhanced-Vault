package com.testmanagementtool.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class UrlNormalizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // Check if the URL contains double slashes
        if (requestUri.contains("//")) {
            // Normalize the URL by replacing multiple slashes with a single slash
            String normalizedUri = requestUri.replaceAll("//+", "/");

            // Forward the request to the normalized URI
            // This allows the request to be matched correctly by the DispatcherServlet
            request.getRequestDispatcher(normalizedUri).forward(request, response);
        } else {
            // Proceed with the chain if no normalization is needed
            filterChain.doFilter(request, response);
        }
    }
}
