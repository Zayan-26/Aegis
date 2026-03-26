package com.aegis.backend.service;

import com.aegis.backend.config.JwtUtil;
import com.aegis.backend.dto.AuthResponse;
import com.aegis.backend.dto.LoginRequest;
import com.aegis.backend.dto.RegisterRequest;
import com.aegis.backend.model.User;
import com.aegis.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    // REGISTER TESTS

    // Valid partition - correct registration
    @Test
    void register_shouldSaveUser_whenValidInputsProvided() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123"))
                .thenReturn("hashedpassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(i -> i.getArgument(0));

        User result = userService.register(request);

        assertEquals("test@test.com", result.getEmail());
        assertEquals("hashedpassword", result.getPasswordHash());
        assertEquals("John Doe", result.getFullName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // invalid partition - email already exists
    @Test
    void register_shouldThrowException_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.findByEmail("existing@test.com"))
                .thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.register(request));

        assertEquals("Email already in use", exception.getMessage());
    }

    // invalid partition - empty email
    @Test
    void register_shouldThrowException_whenEmailIsEmpty() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.findByEmail(""))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode(any()))
                .thenReturn("hashedpassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(i -> i.getArgument(0));

        User result = userService.register(request);
        assertEquals("", result.getEmail());
    }

    // invalid partition - null email
    @Test
void register_withNullEmail_shouldAttemptToSave() {
    RegisterRequest request = new RegisterRequest();
    request.setEmail(null);
    request.setPassword("password123");
    request.setFullName("John Doe");

    when(userRepository.findByEmail(null))
            .thenReturn(Optional.empty());
    when(passwordEncoder.encode(any()))
            .thenReturn("hashedpassword");
    when(userRepository.save(any(User.class)))
            .thenAnswer(i -> i.getArgument(0));

    User result = userService.register(request);
    assertNull(result.getEmail());
}

    // valid partition - password gets hashed not stored plain
    @Test
    void register_shouldHashPassword_notStorePlainText() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");
        request.setFullName("John Doe");

        when(userRepository.findByEmail(any()))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123"))
                .thenReturn("$2a$10$hashedversion");
        when(userRepository.save(any(User.class)))
                .thenAnswer(i -> i.getArgument(0));

        User result = userService.register(request);

        assertNotEquals("password123", result.getPasswordHash());
        assertEquals("$2a$10$hashedversion", result.getPasswordHash());
    }

    // LOGIN TESTS
  
    // valid partition - correct credentials
    @Test
    void login_shouldReturnToken_whenCredentialsAreCorrect() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hashedpassword");
        user.setFullName("John Doe");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedpassword"))
                .thenReturn(true);
        when(jwtUtil.generateToken("test@test.com"))
                .thenReturn("mocktoken123");

        AuthResponse response = userService.login(request);

        assertNotNull(response.getToken());
        assertEquals("mocktoken123", response.getToken());
        assertEquals("test@test.com", response.getEmail());
    }

    // invalid partition - email not found
    @Test
    void login_shouldThrowException_whenEmailNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nobody@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nobody@test.com"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("User not found", exception.getMessage());
    }

    // invalid partition - wrong password
    @Test
    void login_shouldThrowException_whenPasswordIsWrong() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hashedpassword");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashedpassword"))
                .thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("Invalid password", exception.getMessage());
    }

    // edge case - empty password
    @Test
    void login_shouldThrowException_whenPasswordIsEmpty() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hashedpassword");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("", "hashedpassword"))
                .thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("Invalid password", exception.getMessage());
    }

    // edge case - null password
    @Test
    void login_shouldThrowException_whenPasswordIsNull() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword(null);

        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hashedpassword");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches(null, "hashedpassword"))
                .thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.login(request));

        assertEquals("Invalid password", exception.getMessage());
    }
}