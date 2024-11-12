package org.example;

import java.sql.*;
import java.util.HashMap;

public class TestDataFetcher {
    public static HashMap<String, String> getTestData(String flowName, String testCaseName) {
        HashMap<String, String> testData = new HashMap<>();

        try (Connection conn = Main.getConnection();
             Statement stmt = conn.createStatement()) {

            String query = "SELECT testKey, testValue FROM TestScriptData WHERE flowName = ? AND testCaseName = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            preparedStatement.setString(1, flowName);
            preparedStatement.setString(2, testCaseName);
            ResultSet rs = preparedStatement.executeQuery();

            //ResultSet rs = stmt.executeQuery(query);

            while (rs.next()) {
                //System.out.println(rs.getString(2));
                testData.put(rs.getString("testKey"), rs.getString("testValue"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return testData;
    }
}
