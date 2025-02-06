Feature: The Internet Guinea Pig Website

  Scenario Outline: As a user, I can log into the secure area

    Given I am on the login page
    When I login with "nco-admin" and "0TqpKn{N9:68(~z',Yi|"
    And I select "Elasticsearch" menu entry
    When I logout successfully
   

    Examples:
      | username | password             | 
      | nco-admin| SuperSecretPassword! | 
     