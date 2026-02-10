/*package com.entroya;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class TestConnection implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    public static void main(String[] args) {
        SpringApplication.run(TestConnection.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔍 Probando conexión a Supabase...");

        try (Connection connection = dataSource.getConnection()) {
            System.out.println("✅ CONEXIÓN EXITOSA!");
            System.out.println("📊 URL: " + connection.getMetaData().getURL());
            System.out.println("👤 Usuario: " + connection.getMetaData().getUserName());
            System.out.println("🐘 PostgreSQL: " + connection.getMetaData().getDatabaseProductVersion());

        } catch (Exception e) {
            System.err.println("❌ ERROR de conexión:");
            System.err.println("Mensaje: " + e.getMessage());
            e.printStackTrace();
        }

        System.exit(0);
    }
}*/