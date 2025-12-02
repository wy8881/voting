package com.example.voting.configuration;

import com.example.voting.jwt.AuthEntryPointJwt;
import com.example.voting.jwt.AuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.example.voting.component.MyAuthenticationProvider;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@EnableTransactionManagement
public class SecurityConfiguration {

    private final AuthEntryPointJwt unauthorizedHandler;

    private final CorsConfig corsConfig;

    public SecurityConfiguration(AuthEntryPointJwt unauthorizedHandler, CorsConfig corsConfig) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.corsConfig = corsConfig;
    }

    @Bean
    public AuthTokenFilter authenticationTokenFilter() throws Exception {
        return new AuthTokenFilter();
    }

    @Bean
    MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }
    CookieClearingLogoutHandler cookies = new CookieClearingLogoutHandler("Bearer");

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        System.out.println("CORS Allowed Origins: " + corsConfig.getAllowedOrigins());
        System.out.println("CORS Allowed Methods: " + corsConfig.getAllowedMethods());
        configuration.setAllowedOrigins(corsConfig.getAllowedOrigins());
        configuration.setAllowedMethods(corsConfig.getAllowedMethods());
        configuration.setAllowedHeaders(corsConfig.getAllowedHeaders());
        configuration.setAllowCredentials(corsConfig.isAllowCredentials());
        configuration.setMaxAge(corsConfig.getMaxAge());
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain filterChain(HttpSecurity http, MyAuthenticationProvider authenticationProvider) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(unauthorizedHandler))
                .cors(withDefaults())
                .sessionManagement((sessionManagement) -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/auth/*").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/actuator/info").permitAll()
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider);
        http.addFilterBefore(authenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain XSSfilterChain(HttpSecurity http) throws Exception{
        http.csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                        .xssProtection(xss -> xss
                                .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                        )
                );
        return http.build();
    }

}
