
# GPCRCore

An integrated web-based resource for exploring human G protein-coupled receptors (GPCRs), associated molecules, bioactivity, tissue expression, and adverse-event information, with machine-learning-based pChEMBL prediction and potential GPCR target screening.

## Overview

This resource integrates GPCR, molecular, pharmacological, tissue-expression, and adverse-event information from multiple established biological and chemical databases into a unified platform.

The resource provides both an interactive web interface and a programmatic backend for exploring GPCR–molecule relationships and associated biological and pharmacological information.

A machine-learning module based on XGBoost is also provided for:

- pChEMBL prediction for GPCR–molecule combinations
- Potential GPCR target screening from a submitted molecular structure

## Main Features

### GPCR exploration

- Browse GPCRs and associated information
- View GPCR-specific molecular and pharmacological information
- Explore known GPCR ligands and associated molecules
- Examine tissue-expression information
- Explore GPCR structures and related information

### Molecular and bioactivity information

- Browse molecules associated with GPCRs
- View molecular properties and structures
- Explore experimentally reported bioactivity
- Examine ligand-efficiency-related measures where available

### Adverse-event information

Adverse-event terms are organized into a hierarchical structure consisting of:

- Fine-level adverse-event terms
- Intermediate categories
- Coarse organ-system categories

This allows adverse-event information to be explored at different levels of granularity.

### Machine-learning prediction

The resource includes an XGBoost-based pChEMBL prediction model.

The model uses molecular, receptor/target, tissue-expression, and structural fingerprint features to predict pChEMBL values for GPCR–molecule combinations.

The prediction module supports:

1. Prediction for a selected GPCR and molecule
2. Screening of GPCRs for a submitted molecular structure based on predicted pChEMBL values

## Repository Structure

```text
GPCRCore/
├── Backend/
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   └── prediction/
│       ├── feature_metadata.json
│       ├── final_manual_tuned.json
│       ├── gpcr_features.py
│       ├── prediction_service.py
│       ├── predictor.py
│       ├── rdkit_features.py
│       ├── similarity.py
│       └── data/
│           └── mol_fingerprint.parquet
│
├── Frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
│
├── Database/
│   └── gpcr_database_v1.0.backup
│
├── .env.example
├── .gitattributes
├── .gitignore
└── README.md
````

## Requirements

### Backend

* Python 3.10 or compatible Python environment
* PostgreSQL
* RDKit
* FastAPI
* Uvicorn
* Packages listed in `Backend/requirements.txt`

### Frontend

* Node.js
* npm

### Git LFS

The trained model, molecular fingerprint data, and PostgreSQL database backup are stored using Git Large File Storage (Git LFS).

Git LFS is required to retrieve these files from the repository.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shana-abd/GPCR.git
cd GPCR
```

### 2. Initialize Git LFS

Install Git LFS if it is not already installed, then run:

```bash
git lfs install
git lfs pull
```

## Database Setup

A PostgreSQL database backup is provided in:

```text
Database/gpcr_database_v1.0.backup
```

Create a PostgreSQL database locally and restore the backup using PostgreSQL or pgAdmin.

The database connection used by the application is configured through the `DATABASE_URL` environment variable.

For example:

```text
postgresql://username:password@localhost:5432/gpcr_db
```

### Database configuration

The repository contains an example environment configuration:

```text
.env.example
```

Copy the example configuration to create a local `.env` file and replace the placeholder values with the credentials for the local PostgreSQL installation.

The actual `.env` file should not be committed to the repository.

## Backend Setup

From the repository root, create and activate a Python environment and install the backend dependencies:

```bash
pip install -r Backend/requirements.txt
```

Configure the local database connection using the `DATABASE_URL` environment variable.

Start the FastAPI application with:

```bash
uvicorn Backend.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

The FastAPI interactive API documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open a second terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend address in the terminal.

## Prediction Module

The prediction module contains the trained XGBoost model and supporting feature information.

The model uses:

* Molecular chemical descriptors
* GPCR/target features
* Tissue-expression features
* Molecular structural fingerprints

The trained model is provided in:

```text
Backend/prediction/final_manual_tuned.json
```

The molecular fingerprint data used by the prediction workflow is provided in:

```text
Backend/prediction/data/mol_fingerprint.parquet
```

### Potential GPCR target screening

The potential-target screening functionality accepts a molecular structure as input.

The submitted structure is processed to generate the required molecular features. These features are combined with the receptor-specific features for eligible GPCRs, and the trained XGBoost model is used to predict pChEMBL values.

The resulting GPCRs are ranked according to the predicted pChEMBL values and returned through the application.

## Data Sources

The resource integrates information obtained from established chemical and biological databases, including:

* GPCRdb
* ChEMBL
* Human Protein Atlas (HPA)
* GTEx
* SIDER
* OFFSIDES
* openFDA
* DrugBank

Appropriate attribution and citation should be given to the original data sources when using or redistributing the resource.

## Reproducibility

This repository provides the application code, trained prediction model, supporting prediction data, and a PostgreSQL database backup to support local reproduction of the application.

The database backup allows users to restore the database without requiring access to the original database server.

The repository therefore supports **application-level local reproducibility** of the resource.

The repository does not currently include the complete raw-data acquisition and database-construction pipeline required to recreate the database from all original source datasets.

## Citation

If you use this resource, please cite the associated publication:

> Citation information will be added following publication.

## License

License information for the software and repository will be provided with the final release.

Individual datasets and resources incorporated into the database remain subject to the terms and attribution requirements of their respective source databases.

## Contact

For questions regarding the resource, please use the GitHub repository issue tracker or contact the corresponding author of the associated publication.


