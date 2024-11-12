package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/testdata";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root";

    public static Connection getConnection() throws SQLException, SQLException {
        return DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
    }

    public static void main(String[] args) {

        HashMap<String, String> testdata = TestDataFetcher.getTestData("Harmony", "Script2");
//        for (int i = 0; i < testdata.size(); i++) {
//            System.out.println(testdata.);
//        }
        System.out.println("Set View: " + testdata.entrySet());


    }
}