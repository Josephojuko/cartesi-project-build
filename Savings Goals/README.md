# SavingsGoalDapp

This takes into account the target amount, timeframe, initial savings, and annual interest rate to provide a detailed savings plan.

## Installation Instructions

Follow the [Cartesi Rollups installation guide](https://docs.cartesi.io/cartesi-rollups/1.3/development/installation/)

## Compiling and Running Instructions

1. Clone the repository
2. Run `cd savingsgoal`
3. Run `cartesi build`
4. Run `cartesi run`
5. Run `cartesi send` on a new terminal tab to send inputs to the application

## Usage

Send an advance request with a payload in the following format:

```json
{
  "targetAmount": 10000,
  "timeframe": 5,
  "initialSavings": 1000,
  "annualInterestRate": 3
}
```

The DApp will return a notice with the calculated savings plan:

```json
{
  "monthlyContribution": "141.61",
  "totalContributions": "8496.60",
  "totalInterestEarned": "503.40"
}
```
