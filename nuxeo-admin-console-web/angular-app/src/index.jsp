<!--
@license
©2023 Hyland Software, Inc. and its affiliates. All rights reserved. 
All Hyland product names are registered or unregistered trademarks of Hyland Software, Inc. or its affiliates.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<!-- 
<%@ page contentType="text/html; charset=UTF-8" %>

<%
  String context = request.getContextPath();
%> 
-->
<%
    try {
        Class.forName("jakarta.servlet.http.HttpServletResponse");
    } catch (ClassNotFoundException e) {
        Class.forName("javax.servlet.http.HttpServletResponse");
    }
%>
<%@ page import="java.util.UUID"%>
<%
  HttpServletResponse resp = (HttpServletResponse) pageContext.getResponse();
  String NX_NONCE_VALUE = UUID.randomUUID().toString();
  String updatedScriptSrcStr = "'self' 'nonce-" + NX_NONCE_VALUE + "'";
  String cspHeader = resp.getHeader("Content-Security-Policy");
  String newCspHeader = "";
  boolean isExistingCspHeaderEmpty = false;
  if(cspHeader == null || cspHeader.trim().isEmpty()) { 
    isExistingCspHeaderEmpty = true;
    cspHeader = "";
   }
  String scriptSrc = "";
  String directive = null;
  // Replace non-breaking spaces with regular spaces
  cspHeader = cspHeader.replaceAll("\u00A0", " ");  // Normalizing non-breaking spaces
  String[] directives = cspHeader.trim().replaceAll("\\s+", " ").split(";");
  boolean foundScriptSrcMatch = false;
  boolean foundObjectSrcMatch = false;
  for (int i = 0; i < directives.length; i++) {
    directive = directives[i].trim();
    if (directive.startsWith("script-src ")) {
        foundScriptSrcMatch = true;
        directive = directive.trim() + " " + updatedScriptSrcStr;
        directives[i] = directive;
    }
    if (directive.startsWith("object-src ")) {
      foundObjectSrcMatch = true;
    }
  }
  if(foundScriptSrcMatch) {
    newCspHeader =  String.join(";", directives);
  }
  else {
    newCspHeader = cspHeader.trim() + (isExistingCspHeaderEmpty ? " script-src " : "; script-src ") + updatedScriptSrcStr;
  }
  if(!foundObjectSrcMatch){
    newCspHeader = newCspHeader.trim() + "; object-src 'none'";
  }
  resp.setHeader("Content-Security-Policy", newCspHeader);
%>

<!DOCTYPE html>
<html lang="">

<head>
  <meta charset="utf-8" />
  <title>Admin Console</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>

<body>
  <app baseUrl="<%= context %>" ngCspNonce="<%= NX_NONCE_VALUE %>"></app>
</body>

</html>
