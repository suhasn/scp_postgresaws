# devX Code-Camp: Consuming Amazon PostgreSQL in SAP Cloud Platform

## 1. Scenario Background
#### What you will learn in this session

In this session, you will create a Full Stack application on the SAP Cloud Platform to learn how to consume hyperscaler service like PostgreSQL in an application built on SAP Cloud Platform. The app will consume Amazon RDS PostgreSQL instance created on SAP Cloud Platform. The PostgreSQL instance is exposed as REST APIs through a Node.js application which will be consumed in a UI5 application to display the data as a list of items.

We will be building a MTAR (Multi-Target Archive) application which will comprise of a UI5 application along with the Destination required to consume the REST APIs exposed through the Node.js application.

#### Application Landscape

This application will be built on SAP Cloud Platform Cloud Foundry Environment and will consume the following services
* Application Runtime on SAP Cloud Platform
* PostgreSQL on Amazon RDS
* Destination Service on SAP Cloud Platform


### Prerequisites
* SAP Cloud Platform Cloud Foundry account on AWS with a Sub-account and Space .
* Access Key ID: **AKIA4RW7ZMBLPXSDJ6YU**
* Secret Access Key: **HBINoEtedvMhkJkDgaChHLISVejfLZ8UA3m1Qcta**
* AWS VPC ID: **vpc-07553b3f39931a63d**
* Region: **ap-south-1**

### Hands-on Tasks
#### 1. Create a Resource Provider at the Global Account Level

* Login to SAP Cloud Platform Cloud Foundry account and at the Global Account level click on “Resource Providers” option on the navigation menu. Here we would be configuring your AWS account credentials which will be required subsequently to create & manage the RDS PostgreSQL instances. The AWS account credentials shared with SAP will be saved in a secure store.
![Resource Provider View](https://blogs.sap.com/wp-content/uploads/2019/07/1-35.png)

* Click on the “New Provider”. This opens a pop-up dialog where you would have to provide the Hyperscaler Account Credentials. In this case, we would be keying in the AWS account details.
![Resource Provider View](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/1.png)

* Key in the values for the above parameters as per the following:

  a. **Provider**: Choose among the supported Hyperscalers, in this case we will go with AWS as the Hyperscaler.

  b. **Display Name**: Provide a suitable display name for the provider for identification on the cockpit. 

  c. **Technical Name**: Provide a unique technical name. This name would be required by the application developers as a parameter when creating service instances from this provider. **Eg: devx_[INUMBER]_provider**

  d. **Description**: Provide an optional description for this resource provider.

  e. **AWS Access Key ID**: Make use of the Access Key ID that was provided as part of prerequisites.

  f. **AWS Access Key Secret**: Make use of the Secret Access Key that was provided as part of prerequisites.

  g. **AWS VPC ID**: Make use of the VPC ID that was provided as part of prerequisites.

  h. **AWS Region**:Provide the aws region where you want to create the PostgreSQL instances, i.e., where the VPC has been created. Use the region that was provided as part of prerequisites.

  Once you have all the values above, provide that in the dialog pop-up to create a new Resource Provider.
  ![Resource Provider View](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/2.png)


#### 2. Assign Resource Provider Entitlement to your Sub-Account and assign quota of service instances

* Once the new Resource Provider is created, we need to assign the entitlements to the sub-accounts where you create PostgreSQL instances. Click on “Entitlements” -> “Sub-account Assignments” and choose the Sub accounts for which you wish to provide this service entitlement. Click on “Add Service Plans”.

![Sub-Account Entitlements]((https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/3.png))

* Choose the “PostgreSQL on Amazon (AWS)” service from the catalog and choose the service plans from the Resource Provider created/Provided by the instructor. Click on “Add Service Plan” to assign the services to the Sub-account. 

![Sub-Account Entitlements](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/4.png)

* Assign a quota of 1 Unit for PostgreSQL on Amazon(AWS)
![Quota Assignment](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/5.png)

#### 3. Creation of PostgreSQL Instance via the SAP Cloud Platform Cockpit

* Login to the Sub Account and Space which was given the entitlement and go to the ‘Service Marketplace’ tab. You should now be able see “PostgreSQL on Amazon (AWS)” service.
![Service Marketplace](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/6.png)

* Click on the “PostgreSQL on Amazon (AWS)” service tile and see the available plans. Click on the “Instances” option on the navigation menu and click “New Instance”.
![New Instance](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/7.png)

* Choose a service plan as per the requirement and click “Next”. You would see the service plans listed as per the selection during the service entitlement selection. We chose only "development" in step 2, hence only 'development' plan is visible.

![New Instance - Service Plan](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/8.png)

* Configure the Additional Parameters are as below, make sure you correctly provide the 'resourceTechnicalName' as per the value provided during the Resource Provider creation. And 'dbName' as 'mydb_<INUMBER>'

```javascript
{
	"adminPassword": "c0deCampAdmin123", //Atleast 12 characters long
	"adminUsername": "codecampAdmin", //Atleast 12 characters long
	"backupRetentionPeriod": 14, //Period in days
	"dbEngineMajorVersion": "9.6", //PostgreSQL DB Engine Version 
	"dbInstanceType": "db.t2.micro", // Instance type more options can be found in help
	"dbName": "<mydb_INUMBER>", //Name of the Database Instance
	"multiAz": true, //Multi Availability Zone Support Required
	"resourceTechnicalName": "<devx_<INUMBER>_provider>", //Technical name of the resource provider to be used
	"storageEncrypted": false, //Flag to choose if the data needs to be encrypted
	"storageGb": 20 //Storage in GB required
}
```
![New Instance - Service Plan](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/9.png)

* You could leave the application blank for now and confirm the service instance creation with a instance name as 'codecampdb_INUMBER' and click ‘Finish’.

![New Instance - Final Step](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/10.png)

![New Instance - Final Step](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/11.png)

* PostgreSQL instance will get created in AWS RDS Region of our choice. (Instructor to show the instance created on AWS Console)

![AWS Console Creating](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/12.png)

Now, the PostgreSQL instance is created.


#### 4. Configure the SQuirrel SQL Client and add test data

* By default the SQuirrel client will not have the required JDBC drivers, download them from the Prerequities guide for PostgreSQL.

* Click on the 'Drivers' tab on SQuirrel Client and choose PostgreSQL. Notice that 'X' icon denoting that the driver is not available. Right Click on the "PostgreSQL" item and Choose "New Driver"
![Postgresql driver unavailable1](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/25.png)

On the dialog pop-up, choose "Extra Class Path" and click "Add".
![Postgresql driver unavailable2](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/26.png)

Navigate to the location of the PostgreSQL JDBC driver and select it and click OK.
![Postgresql driver unavailable3](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/27.png)

You can notice the PostgreSQL driver is now available with a Green Check mark.
![Postgresql driver available](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/28.png)

* Connect SQL Client to Access the PostgreSQL Database and enter values. Open SQuirrel SQL Client and create a new connection Alias as below with your database name:
![SQurriel Client Alias Creation](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/29.png)


* Open the SQL Window for the database and insert some values using the query:
```sql
INSERT INTO employee_details(emp_id, first_name, last_name, gender, department) values ('101','John','Doe','Male','DevX-Postgresql')
```


#### 5. MTAR Application Creation

* Download the application code from https://github.com/suhasn/scpawsbrokerdemo.git

##### MTA Configuration

* Navigate to the application folder and open the mta.yml file in your text editor, review the contents of the file and update the AWS PostgreSQL Instance name as per the instance that was created in the previous step 'codecampdb_INUMBER'. 

```yaml
  ID: codeCampDemo
_schema-version: '2.1'
description: 'CF Demo MTAR Application with SAP UI5, Nodejs and Amazon PostgreSQL'
version: 0.0.1
modules:
  - name: restapis
    type: nodejs
    path: restapis
    provides:
      - name: restapis_api
        properties:
          url: '${default-url}'
    requires:
      - name: <codecampdb_INUMBER>
  - name: ui_codeCampDemo
    type: html5
    path: ui_codeCampDemo
    parameters:
      disk-quota: 256M
      memory: 256M
    requires:
      - name: uaa_codeCampDemo
      - name: dest_codeCampDemo
      - name: restapis_api
resources:
  - name: uaa_codeCampDemo
    parameters:
      path: ./xs-security.json
      service-plan: application
      service: xsuaa
    type: org.cloudfoundry.managed-service
  - name: dest_codeCampDemo
    parameters:
      service-plan: lite
      service: destination
    type: org.cloudfoundry.managed-service
  - name: <codecampdb_INUMBER>
    type: org.cloudfoundry.existing-service
    description: AWS PostgreSQL DB
    parameters:
      service: aws-rds-postgresql
      service-plan: development

 ``` 
 
##### Node.js Application
* Open the file restapis/db/dbOp.js and un-comment the code to fetch the PostgreSQL instance connection parameters from the environment variable.

```javascript
		// UNCOMMENT THE BELOW GET SERVICES CODE

		// const servicesENV = xsenv.getServices({
		// 	 'aws-rds-postgresql': {
		// 	 	tag: "postgresql"
		// 	 }
		// });
```

##### UI5 Application
* Next, we will review the UI5 code. Open the file ui_codeCampDemo/webapp/controller/View1.controller.js. Here we are fetching the list of employees from the REST API 'getAllEmployees' into a JSON Model. Provide a local name for the the json model which we shall use to list all the employees in the UI.

Here change the [JSON MODEL NAME] to a name like 'EmployeesJSONModel' and save the file.

```javascript
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.demo.codecamp.ui.controller.View1", {
		onInit: function () {

			var employeesModel = new sap.ui.model.json.JSONModel();

			employeesModel.loadData(
				"/getAllEmployees", null, true, 'GET'
			);
			this.getView().setModel(employeesModel, "[JSON MODEL NAME]"); //EmployeesJSONModel
		}
	});
 ```
});

* We need to use this JSON name in our XML view in the UI5 application. Open the file ui_codeCampDemo/webapp/view/View1.view.xml. 

Change the [JSON MODEL NAME] placeholder to the value given above in the View1.controller.js. (EmployeesJSONModel)

```xml
<mvc:View controllerName="com.sap.demo.codecamp.ui.controller.View1" xmlns:mvc="sap.ui.core.mvc" displayBlock="true" xmlns="sap.m">
	<Shell id="shell">
		<App id="app">
			<pages>
				<Page id="page" title="{i18n>title}">
					<content>
						<List id="employeeList" width="auto" items="{ [JSON MODEL NAME] >/}">
							<items>
								<ObjectListItem title="{[JSON MODEL NAME]>first_name} {[JSON MODEL NAME]>last_name}" intro="{[JSON MODEL NAME]>department}" type="Navigation"/>
							</items>
						</List>
					</content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View>

```
##### Destination Service Configuration in UI5 App

* Open ui_codeCampDemo/xs-app.json, provide a name to the destination field <restapi_dest_INUMBER>

```json
{
	"welcomeFile": "/ui_codeCampDemo/index.html",
	"authenticationMethod": "none",
	"logout": {
		"logoutEndpoint": "/do/logout"
	},
	"routes": [{
		"source": "^/ui_codeCampDemo/(.*)$",
		"target": "$1",
		"localDir": "webapp"
	}, {
		"source": "/getAllEmployees",
		"target": "/api/getAllEmployees",
		"destination": "<restapi_dest_INUMBER>"
	}]
}
```

* Build the MTAR file using the command.

> Command: java -jar [path to mta.jar] –-[option][=arguments] [command]. (Documentation: https://help.sap.com/viewer/58746c584026430a890170ac4d87d03b/Cloud/en-US/9f778dba93934a80a51166da3ec64a05.html)

For Instance:

```script
java -jar ../mta_archive_builder-1.1.19.jar --build-target CF --mtar scpawsbrokerdemo.mtar build
```
![MTAR Build](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/13.png)

You should see the MTAR build successfully.
![MTAR Build](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/14.png)

* Deploy the MTAR file using the MTAR CF CLI.
![MTAR Deploy](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/21.png)


* Verify there are 2 new applications created - restapis and ui_codeCampDemo. 
![Apps Created](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/22.png)

* Verify there are 2 new service instances bound to ui_codeCampDemo and PostgreSQL instance that we created is now bound to restapis application
![Service Instances](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/23.png)

* Navigate to **restapis** application and click on the application route to ensure the application is running. You should see the below screen on the UI.
![RestAPI Application](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/30.png)

* Now, lets verify if the data created from SQuirrel Client can be seen by accessing a REST API by appending **/api/getAllEmployees** to the above restapis application URL and we will see the data being displayed.
![RestAPI Application UI](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/31.png)

* Navigate to **ui_codeCampDemo** application and click on the application route, this should open the UI5 application with the "No Data" in the List of Employees.

![Nodata List Application UI](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/32.png)


In order to get the list of data exposed by restapis application in our UI5 application ui_codeCampDemo, we need to create a destination.


#### 6. Destination Creation

* From the SAP Cloud Platform cockpit open the service instance 'dest_codeCampDemo', navigate to "Destinations" tab and click on "New Destination"

![New Destination ](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/17.png)

* Create a new destination with the values
	1. Name as provided in the xs-app.json - <restapi_dest_INUMBER>
	2. URL: Application route of the application 'restapis'. (Get it from the SAP Cloud Platform cockpit)
	3. Proxy Type: Internet
	4. Authentication: NoAuthentication
![New Destination ](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/18.png)

* Check connection to verify if the destination is reachable. You should get a successful connection message.

#### 7. Verify the UI5 application to list the employees

Now, once the destination is configured - navigate to the ui_codeCampDemo application on SAP Cloud Platform and click on the application route link. Now, we should see the list of employees. In this case we should see one entry as below:

![Final App Screen](https://github.com/suhasn/scpawsbrokerdemo/blob/master/images/33.png)

With this we have successfully learnt how to create and consume AWS PostgreSQL instance in SAP Cloud Platform via Node.js and UI5 application.




	
	


