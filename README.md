# GPCRCore

An integrated web-based resource for exploring human G protein-coupled receptors (GPCRs), associated molecules, bioactivity, tissue expression, and adverse-event information, with machine-learning-based pChEMBL prediction and potential GPCR target screening.

## Overview

GPCRCore integrates GPCR, molecular, pharmacological, tissue-expression, and adverse-event information from multiple established biological and chemical databases into a unified platform.

The resource provides both an interactive web interface and a programmatic backend (REST API) for exploring GPCR–molecule relationships and associated biological and pharmacological information.

A machine-learning module based on XGBoost is also provided for:

- pChEMBL prediction for GPCR–molecule combinations
- Potential GPCR target screening from a submitted molecular structure

Predictions are intended for research and hypothesis generation only. They are not a substitute for experimental validation or clinical decision-making.

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

Adverse-event terms are organized into a three-level hierarchy:

- Fine-level adverse-event terms
- Mid-level functional categories
- Coarse organ-system categories

This hierarchy was developed for organizing and browsing the data within this resource. It is not a clinically validated ontology or a severity scale.

### Machine-learning prediction

The resource includes an XGBoost-based pChEMBL prediction model. The model uses molecular, receptor/target, tissue-expression, and structural fingerprint features to predict pChEMBL values for GPCR–molecule combinations.

The prediction module supports:

1. Prediction for a selected GPCR and molecule
2. Screening of GPCRs for a submitted molecular structure, ranked by predicted pChEMBL value

## Repository Structure

```text
GPCR/
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
│   └── GPCRCore_v1_0_2.backup
│
├── .env.example
├── .gitattributes
├── .gitignore
├── CITATION.cff
├── LICENSE
└── README.md
```

## Data Archive (Zenodo)

The trained prediction model, molecular fingerprint file, and PostgreSQL database backup are archived on Zenodo:

[https://doi.org/10.5281/zenodo.23005024]

The model, fingerprint file, and database backup in this repository are stored with Git LFS. If `git lfs pull` fails (for example because of LFS bandwidth limits), or if you downloaded this repository as a zip archive, these files may be small placeholder files of about 1 KB. In that case, download the full files from the Zenodo record above and place them at the paths shown under "Repository Structure".

## Requirements

### Backend

- Python 3.10 or compatible
- PostgreSQL 17
- RDKit
- FastAPI
- Uvicorn
- Packages listed in `Backend/requirements.txt`

### Frontend

- Node.js
- npm

### Git LFS

Git LFS is required to retrieve the model, fingerprint data, and database backup from this repository. Alternatively, download them from the Zenodo record above.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shana-abd/GPCR.git
cd GPCR
```

### 2. Retrieve the large files

Install Git LFS if it is not already installed, then run:

```bash
git lfs install
git lfs pull
```

If this does not work, use the Zenodo archive described above.

## Database Setup

A PostgreSQL database backup is provided in:

```text
Database/GPCRCore_v1_0_2.backup
```

Create an empty PostgreSQL database and restore the backup. From the command line:

```bash
createdb -U username gpcr_db
pg_restore -U username -d gpcr_db Database/GPCRCore_v1_0_2.backup
```

Alternatively, restore the backup through pgAdmin. Use a PostgreSQL version equal to or newer than the one used to create the backup.

### Database configuration

The database connection is configured through the `DATABASE_URL` environment variable, for example:

```text
postgresql://username:password@localhost:5432/gpcr_db
```

The repository contains an example configuration file, `.env.example`. Copy it into the `Backend` directory as `.env` and replace the placeholder values with the credentials for your local PostgreSQL installation. Do not commit the actual `.env` file to the repository.

## Backend Setup

From the repository root, create and activate a Python environment and install the backend dependencies:

```bash
pip install -r Backend/requirements.txt
```

Start the FastAPI application:

```bash
uvicorn Backend.main:app --reload
```

The backend is normally available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open a second terminal and go to the frontend directory:

```bash
cd Frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server prints the local frontend address in the terminal.

## Prediction Module

The prediction module contains the trained XGBoost model and supporting feature information.

The model uses:

- Molecular chemical descriptors
- GPCR/target features
- Tissue-expression features
- Molecular structural fingerprints

The trained model is provided in:

```text
Backend/prediction/final_manual_tuned.json
```

The molecular fingerprint data used by the prediction workflow is provided in:

```text
Backend/prediction/data/mol_fingerprint.parquet
```

### Potential GPCR target screening

The target-screening function accepts a molecular structure as input. The structure is processed to generate the required molecular features, which are combined with the receptor-specific features for eligible GPCRs. The trained XGBoost model predicts a pChEMBL value for each molecule–GPCR pair, and the GPCRs are ranked by predicted pChEMBL value.

These are model-based predictions and should not be taken as experimentally confirmed ligand–receptor interactions.

## Data Sources

The resource integrates information obtained from established chemical and biological databases, including:

- GPCRdb
- ChEMBL
- PubChem
- Human Protein Atlas (HPA)
- GTEx
- SIDER
- OFFSIDES
- OpenFDA
- DrugBank

Appropriate attribution and citation should be given to the original data sources when using or redistributing the resource.

DrugBank-derived information was used under an academic non-commercial license. The raw DrugBank dataset is not redistributed. Users who need the complete DrugBank dataset should obtain it directly from DrugBank under the applicable license terms.

## Reproducibility

This repository provides the application code, trained prediction model, supporting prediction data, and a PostgreSQL database backup to support local reproduction of the application. The database backup allows users to restore the database without access to the original database server.

The repository therefore supports application-level local reproducibility of the resource. It does not currently include the complete raw-data acquisition and database-construction pipeline required to recreate the database from all original source datasets.

## Citation

To cite this software, use the "Cite this repository" button on GitHub (see `CITATION.cff`) or the Zenodo record:

[https://doi.org/10.5281/zenodo.23005024]

A citation for the associated publication will be added following publication.

## License

The source code is released under the MIT License (see `LICENSE`).

The archived database and trained model are distributed under CC BY-SA 4.0 (see the Zenodo record).

Individual datasets and resources incorporated into the database remain subject to the terms and attribution requirements of their respective source databases.

## Contact

For questions regarding the resource, please use the GitHub issue tracker or contact the corresponding author of the associated publication.