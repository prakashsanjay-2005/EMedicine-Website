CREATE DATABASE EMedicine;
GO

USE EMedicine;
GO

CREATE TABLE Users (
    Id INT IDENTITY PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(200),
    Role VARCHAR(50), -- Admin / User
    Status INT,
    CreatedOn DATETIME DEFAULT GETDATE()
);

CREATE TABLE Medicines (
    Id INT IDENTITY PRIMARY KEY,
    Name VARCHAR(150),
    Description VARCHAR(500),
    Price DECIMAL(18,2),
    Stock INT,
    CreatedOn DATETIME DEFAULT GETDATE()
);

CREATE TABLE Carts (
    Id INT IDENTITY PRIMARY KEY,
    UserId INT,
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE CartItems (
    Id INT IDENTITY PRIMARY KEY,
    CartId INT,
    MedicineId INT,
    Quantity INT,
    FOREIGN KEY (CartId) REFERENCES Carts(Id),
    FOREIGN KEY (MedicineId) REFERENCES Medicines(Id)
);

CREATE TABLE Orders (
    Id INT IDENTITY PRIMARY KEY,
    UserId INT,
    TotalAmount DECIMAL(18,2),
    Status VARCHAR(50), -- Pending, Completed
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE OrderItems (
    Id INT IDENTITY PRIMARY KEY,
    OrderId INT,
    MedicineId INT,
    Quantity INT,
    Price DECIMAL(18,2),
    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (MedicineId) REFERENCES Medicines(Id)
);

EXEC sp_rename 'Cart', 'Carts';

UPDATE Users
SET Role = 'Admin'
WHERE Id = 2;


SELECT * FROM Users;
SELECT * FROM Carts;
SELECT * FROM Medicines;
SELECT * FROM CartItems;
SELECT * FROM OrderItems;
SELECT * FROM Orders;

DELETE FROM OrderItems
WHERE MedicineId = 1;

DELETE FROM CartItems
WHERE MedicineId = 1;

SELECT Id, Email, Role
FROM Users;

SELECT * FROM __EFMigrationsHistory;

INSERT INTO __EFMigrationsHistory
(MigrationId, ProductVersion)
VALUES
('20260617140011_InitialCreate', '8.0.0');

DELETE FROM __EFMigrationsHistory
WHERE MigrationId = '20260617140011_InitialCreate';

UPDATE Users
SET Role = 'Admin'
WHERE Email = 'newtest@gmail.com';

SELECT Id, Email, Role
FROM Users;

SELECT Id, Name, ImageUrl
FROM Medicines;

SELECT Id, UserId, TotalAmount, Status
FROM Orders;

UPDATE Medicines
SET ImageUrl = 'https://picsum.photos/200'
WHERE Id = 1;

SELECT Id, UserId, TotalAmount, Status, OrderDate
FROM Orders;

UPDATE Orders
SET OrderDate = GETDATE()
WHERE OrderDate = '0001-01-01';

ALTER TABLE Users
ADD Address NVARCHAR(500),
    City NVARCHAR(100),
    Pincode NVARCHAR(20),
    PhoneNumber NVARCHAR(15);