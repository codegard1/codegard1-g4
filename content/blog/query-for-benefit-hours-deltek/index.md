---
title: "Query for Benefit Hours in Deltek Vision"
tags: ["sql","deltek","vision"]
published: true
date: "2021-05-14"
---

# Gist

This page contains notes on retrieving Benefit (PTO) hours directly from the Vision database (Using Deltek Vision 7 on-prem).

# Vision Tables
This query makes use of the following tables in `dbo.[Vision]`
- `[EMAccrualDetail]`
- `[EMAccrual]`
- `[EM]`
- `[CFGAccrualScheduleDetail]`

# Calculations 

## Quantum
- Weekly rate for PTO accrual, which is a certain number of hours per year divided by 52. Each employee has either a custom accrual rate (stored in `[CFGAccrualScheduleDetail].[HoursPerYear]`) or follows a PTO Accrual Schedule (stored in [EMAccrual].[ScheduleID]).

## Sum of Earned
- Sum of all earned hours for years previous

## Sum of Taken
- Sum of all hours taken in years previous

## Starting Balance 
- One week's earned hours, plus the sum of Earned hours for all years previous, minus the sum of all hours taken for years previous.

## Current Balance
- The sum of Starting Balance and hours earned for the current year, minus the sum of hours taken for the current year.

## Earned for Current Year
- The sum of hours earned for the current year, minus one week's earned hours

## Taken for Current Year
- The sum of hours taken for the current year

# SQL Query
This has not been tested with a wide variety of different users (with different accrual schedules) but it does produce the same numbers as Deltek does (for me, at least). 

```sql
USE Vision;
GO

-- Declare variables
DECLARE 
    @CurrentUser nvarchar(255),
    @CurrentYear int,
    @EarnedForCurrentYear float,
    @TakenForCurrentYear float,
    @CurrentBalance float,
    @SumOfEarned float,
    @SumOfTaken float,
    @StartingBalance float,
    @Quantum float;

--  Set the current user by email address 
SET @CurrentUser = 'chris@contoso.com';

-- Get the current year from current date
SET @CurrentYear = YEAR( GETDATE() );

-- Number of hours earned per week, determined by the PTO ScheduleID in [EMAccrual]
-- Hours Per Year is stored in [CFGAccrualScheduleDetail].HoursPerYear if the employee 
-- uses a standard rate. Otherwise the number of hours per year is recorded in 
-- [EMAccrual].[HoursPerYear]. Since only one of these is ever used (the other is NULL or 
-- zero), adding them  together produces a valid result.
SET @Quantum = (
    SELECT 
        [EMAccrual].[HoursPerYear] + [CFGAccrualScheduleDetail].HoursPerYear
    FROM dbo.[EMAccrual]
        LEFT JOIN [CFGAccrualScheduleDetail]
            ON [CFGAccrualScheduleDetail].[ScheduleID] = [EMAccrual].[ScheduleID]
        LEFT JOIN [EM]
            ON [EM].[Employee] = [EMAccrual].[Employee]
    WHERE [EM].[EMail] = @CurrentUser
) / 52 -- divide by 52 to get the weekly accrual rate

-- Set sum of earned PTO from previous years
SET @SumOfEarned = (
    SELECT
        SUM([EMAccrualDetail].[Earned])
    FROM
        dbo.[EMAccrualDetail]
        LEFT JOIN [EM] ON [EM].[Employee] = [EMAccrualDetail].[Employee]
    WHERE
        LEFT([EMAccrualDetail].[Period], 4) <> @CurrentYear
        AND [EMAccrualDetail].[Code] = 'PTO'
        AND [EM].[Email] = @CurrentUser
);

-- Set sum of taken PTO from previous years
SET @SumOfTaken = (
    SELECT
        SUM([EMAccrualDetail].[Taken])
    FROM
        [EMAccrualDetail]
        LEFT JOIN [EM] ON [EM].[Employee] = [EMAccrualDetail].[Employee]
    WHERE
        LEFT([EMAccrualDetail].[Period], 4) <> @CurrentYear
        AND [EMAccrualDetail].[Code] = 'PTO'
        AND [EM].[Email] = @CurrentUser
);

SET @EarnedForCurrentYear = (
    SELECT
        SUM([EMAccrualDetail].[Earned]) - @Quantum
    FROM
        [EMAccrualDetail]
        LEFT JOIN dbo.EM ON [EM].[Employee] = [EMAccrualDetail].[Employee]
    WHERE 
        LEFT([EMAccrualDetail].[Period], 4) = @CurrentYear
        AND [EMAccrualDetail].[Code] = 'PTO'
        AND [EM].[Email] = @CurrentUser
);

SET @TakenForCurrentYear = (
    SELECT
        SUM([EMAccrualDetail].[Taken])
    FROM
        [EMAccrualDetail]
        LEFT JOIN [EM] ON [EM].[Employee] = [EMAccrualDetail].[Employee]
    WHERE
        LEFT([EMAccrualDetail].[Period], 4) = @CurrentYear
        AND [EMAccrualDetail].[Code] = 'PTO'
        AND [Email] = @CurrentUser
);

-- The quantum plus the difference between all earned and taken PTO for previous years
SET @StartingBalance = (
    @Quantum + (@SumOfEarned - @SumOfTaken)
)

-- The sum of Starting Balance and hours earned for the current year, minus the sum of hours taken for the current year.
SET @CurrentBalance = (
    (@StartingBalance + @EarnedForCurrentYear) - @TakenForCurrentYear
)

-- Display results
SELECT
    ROUND(@Quantum, 2) as 'Quantum'
    ,ROUND(@StartingBalance, 2) as 'Starting Balance'
    ,ROUND(@EarnedForCurrentYear, 2) as 'Current Year Earned'
    ,ROUND(@TakenForCurrentYear, 2) as 'Current Year Taken'
    ,ROUND(@CurrentBalance, 2) as 'Current Balance'
    ,ROUND(@SumOfEarned, 2) as 'Sum of Earned'
    ,ROUND(@SumOfTaken, 2) as 'Sum of Taken'
    -- ,@CurrentYear as 'Current Year',
    -- ,@CurrentUser as 'Current User'

```

## Query Results
|Starting Balance	| Current Year Earned	|Current Year Taken	|Current Balance	|Sum of Earned	|Sum of Taken|
|-----|-----|-----|-----|-----|-----|
|57.66|154.98|96|116.64|232.47|178.5|
