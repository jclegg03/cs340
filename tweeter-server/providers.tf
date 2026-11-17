// AI-assisted: see AI-ATTRIBUTION.md

terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.80"
        }
        archive = {
            source = "hashicorp/archive"
            version = "~> 2.4"
        }
    }
}

provider "aws" {
    region = "us-west-2"
    profile = "personal"
}
