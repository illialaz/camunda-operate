Add env file from Camunda console -> Clusters -> "Your cluster" -> API -> Create new client (with Operate and Zeebe access) by adding REACT_APP_ prefix before every env variable
Also add REACT_APP_CAMUNDA_PROXY_URL to your own proxy, which should redirect all the requests to CAMUNDA_OPERATE_BASE_URL (you should create a proxy by your own)
