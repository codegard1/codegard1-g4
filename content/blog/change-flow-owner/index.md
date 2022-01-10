---
title: "Change the owner of a Power Automate workflow using PowerShell"
tags: ["powerautomate","powerplatform","m365"]
published: true
date: "2022-01-10"
---

You can change the owner of a Flow if you are the creator of the Flow or if you have Global Admin privileges in the tenant. 

```powershell
# First, install the `AzureAd` module if it's not already installed. Otherwise, Import it
Install-Module AzureAd
Import-Module AzureAd -Verbose

# Connect to Azure AD and get the ID of the current owner of the flow.
Connect-AzureAd
$uid = Get-AzureAdUser -ObjectID username@org.com | Select-Object ObjectId

# Optionally cache your credentials using the below cmdlet
Add-PowerAppsAccount

# Get all flows created by the given user
Get-AdminFlow -CreatedBy $uid

```

Sample Output:
```
FlowName         : 5846ebb0-0000-0000-0000-f5564aefdf9b
Enabled          : True
DisplayName      : CoolFlow2000: Create Profits 10x
UserType         :
CreatedTime      : 2021-09-09T16:08:25.372062Z
CreatedBy        : @{tenantId=662464a5-0000-0000-0000-f4771c7df5a7;
                   objectId=b7ad96f2-0000-0000-0000-ce05758b4db2;
                   userId=b7ad96f2-0000-0000-0000-ce05758b4db2; userType=ActiveDirectory}
LastModifiedTime : 2021-10-07T21:23:29.9401081Z
EnvironmentName  : 753ff239-0000-0000-0000-c2a0ec20c82a
Internal         : @{name=5846ebb0-0000-0000-0000-f5564aefdf9b; id=/providers/Microsoft.ProcessSimple
                   /environments/753ff239-0000-0000-0000-c2a0ec20c82a/flows/5846ebb0-0000-0000-0000-f
                   5564aefdf9b; type=Microsoft.ProcessSimple/environments/flows; properties=}
```

Copy the `Environment` and `FlowName` properties to variables.

```powershell
# Set the owner of the flow to the given user
Set-AdminFlowOwnerRole ` 
  -EnvironmentName $EnvironmentName `
  -FlowName $FlowName `
  -RoleName CanEdit `
  -PrincipalType User `
  -PrincipalObjectID $uid
```

Also, you can use PowerShell to disable or enable flows, which can help if the above commands do not work as expected. 

```powershell
# Disable a flow
Disable-AdminFlow -EnvironmentName $EnvironmentName -FlowName $FlowName

# Re-enable the flow
Enable-AdminFlow -EnvironmentName $EnvironmentName -FlowName $FlowName
```

Source: [Microsoft.PowerApps.Administration.PowerShell | Microsoft Docs](https://docs.microsoft.com/en-us/powershell/module/microsoft.powerapps.administration.powershell/?view=pa-ps-latest)