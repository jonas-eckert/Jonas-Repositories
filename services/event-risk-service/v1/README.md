# Event Risk Service v1

## Table of Contents

- [Overview](#overview)
- [Pre-requisites](#pre-requisites)
- [Getting Started](#getting-started)


## Overview

The Event Risk Service receives requests from Oracle ATG, transforms them into Mason format, conducts validation, and then transforms the request into Accertify format before forwarding it to Accertify. Accertify's response is then transformed back to Mason format, and finally converted back to Oracle ATG's expected format. 

The Event Risk Service is deployed on AWS-Lambda using the serverless framework. The serverless.yml file contains all the integrations required to successfully deploy the service on AWS-Lambda.

## Pre-requisites

- NodeJS
- NPM
- AWS CLI configured with appropriate permissions
- Serverless Framework
- Basic understanding of TypeScript, Serverless and AWS Service

## Getting Started

1. **Clone the repository** 
    You will need to clone the AWS-SOA respository, you can use the GitHub desktop app or run this command in your directory.

    `https://github.com/Mason-Companies-Inc/aws-soa.git`

2. **Setup root dependencies**
    You will need to setup dependecies in the root AWS-SOA directory. Once in the aws-soa directory, run:

    `npm install`

    This will install the dependicies that are required to run, deploy and test files from the root.

3. **Setup service dependencies**
    You will need to setup the dependencies that are required for that service, run:

    `npm install`

    This will install the dependices that are required to run, deploy and test files from this service.
