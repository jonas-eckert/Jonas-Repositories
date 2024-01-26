# Mason Order Service Entity v7

## Table of Contents

- [Overview](#overview)
- [Pre-requisites](#pre-requisites)
- [Getting Started](#getting-started)

## Upstream Services
	- oraclecommerce-order-service-task (AWS)

## Downstream Services
	- advantage-order-service-utility v8 (AWS)

## Overview

The Mason Order Service Entity receives requests from upstream services, validates request, and forwards to downstream services.

The Mason Order Service Entity is deployed on AWS-Lambda using the serverless framework. The serverless.yml file contains all the integrations required to successfully deploy the service on AWS-Lambda.

## Pre-requisites

- NodeJS
- NPM
- AWS CLI configured with appropriate permissions
- Basic understanding of Serverless and AWS Service

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
