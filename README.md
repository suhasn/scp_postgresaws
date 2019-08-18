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
* AWS VPC ID: **vpc-07553b3f39931a63d**
* Access Key ID: **AKIA4RW7ZMBLPXSDJ6YU**
* Secret Access Key: **HBINoEtedvMhkJkDgaChHLISVejfLZ8UA3m1Qcta**
* Region: **ap-south-1**

### Hands-on Tasks
##### 1. Create a Resource Provider at the Global Account Level

* Login to SAP Cloud Platform Cloud Foundry account and at the Global Account level click on “Resource Providers” option on the navigation menu. Here we would be configuring your AWS account credentials which will be required subsequently to create & manage the RDS PostgreSQL instances. The AWS account credentials shared with SAP will be saved in a secure store.
![Resource Provider View](https://blogs.sap.com/wp-content/uploads/2019/07/1-35.png)

* Click on the “New Provider”. This opens a pop-up dialog where you would have to provide the Hyperscaler Account Credentials. In this case, we would be keying in the AWS account details.
![Resource Provider View](https://blogs.sap.com/wp-content/uploads/2019/07/2-22.png)

* Key in the values for the above parameters as per the following:

  a. **Provider**: Choose among the supported Hyperscalers, in this case we will go with AWS as the Hyperscaler.

  b. **Display Name**: Provide a suitable display name for the provider for identification on the cockpit. 

  c. **Technical Name**: Provide a unique technical name. This name would be required by the application developers as a parameter when creating service instances from this provider. **Eg: devx_<INUMBER>_provider**

  d. **Description**: Provide an optional description for this resource provider.

  e. **AWS Access Key ID**: Make use of the Access Key ID that was provided as part of prerequisites.

  f. **AWS Access Key Secret**: Make use of the Secret Access Key that was provided as part of prerequisites.

  g. **AWS VPC ID**: Make use of the VPC ID that was provided as part of prerequisites.

  h. **AWS Region**:Provide the aws region where you want to create the PostgreSQL instances, i.e., where the VPC has been created. Use the region that was provided as part of prerequisites.

  Once you have all the values above, provide that in the dialog pop-up to create a new Resource Provider.
  ![Resource Provider View](https://blogs.sap.com/wp-content/uploads/2019/07/7-16.png)


##### 2. Assign Resource Provider Entitlement to your Sub-Account and assign quota of service instances

* Once the new Resource Provider is created, we need to assign the entitlements to the sub-accounts where you create PostgreSQL instances. Click on “Entitlements” -> “Sub-account Assignments” and choose the Sub accounts for which you wish to provide this service entitlement. Click on “Add Service Plans”.

![Sub-Account Entitlements](https://blogs.sap.com/wp-content/uploads/2019/07/8-14.png)

* Choose the “PostgreSQL on Amazon (AWS)” service from the catalog and choose the service plans from the Resource Provider created/Provided by the instructor. Click on “Add Service Plan” to assign the services to the Sub-account. 

![Sub-Account Entitlements](https://blogs.sap.com/wp-content/uploads/2019/07/8-14.png)

* Assign a quota of 1 Unit for PostgreSQL on Amazon(AWS)
![Quota Assignment]()

##### 3. Creation of PostgreSQL Instance via the SAP Cloud Platform Cockpit

* Login to the sub-account which was given the entitlement and go to the ‘Service Marketplace’ tab. You should now be able see “PostgreSQL on Amazon (AWS)” service.
![Service Marketplace](https://blogs.sap.com/wp-content/uploads/2019/07/23-7.png)

* Click on the “PostgreSQL on Amazon (AWS)” service tile and see the available plans. Click on the “Instances” option on the navigation menu and click “New Instance”.
![New Instance](https://blogs.sap.com/wp-content/uploads/2019/07/24-7.png)

* Choose a service plan as per the requirement and click “Next”.
![New Instance - Service Plan](https://blogs.sap.com/wp-content/uploads/2019/07/14-7.png)

* Configure the Additional Parameters are as below, make sure you correctly provide the 'resourceTechnicalName' as per the value provided during the Resource Provider creation. And 'dbName' as 'mydb_<INUMBER>'

```javascript
{
	"adminPassword": "codecampAdmin", //Atleast 12 characters long
	"adminUsername": "c0deCampAdmin123", //Atleast 12 characters long
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

* You could leave the application blank for now and confirm the service instance creation with a instance name as 'codecampdb_INUMBER' and click ‘Finish’.

![New Instance - Final Step]()

##### 4. MTAR Application Creation

* Download the application code from https://github.com/suhasn/scpawsbrokerdemo.git

###### MTA Configuration

* Navigate to the application folder and open the mta.yml file in your text editor, review the contents of the file and update the AWS PostgreSQL Instance name as per the instance that was created in the previous step 'codecampdb_INUMBER'. 

```yaml
  - name: <codecampdb_INUMBER>  
    type: org.cloudfoundry.existing-service
    description: AWS PostgreSQL DB
    parameters:
      service: aws-rds-postgresql
      service-plan: development
 ``` 
 
###### Node.js Application
* Open the file restapis/db/dbOp.js and un-comment the code to fetch the PostgreSQL instance connection parameters from the environment variable.

```javascript
		// UNCOMMENT THE BELOW GET SERVICES CODE

		// const servicesENV = xsenv.getServices({
		// 	 'aws-rds-postgresql': {
		// 	 	tag: "postgresql"
		// 	 }
		// });
```

###### UI5 Application
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
								<ObjectListItem title="{restEmployees>first_name} {restEmployees>last_name}" intro="{restEmployees>department}" type="Navigation"
									press="onPressContact"/>
							</items>
						</List>
					</content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View>

```
###### Destination Configuration

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

*
