using System;
using System.Drawing;
using System.Collections.Generic;
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;

public class BotSatu : Bot
{
    /* Coward Bot */
    private List<ScannedBotEvent> scannedBot = new List<ScannedBotEvent>();
    private Dictionary<int, double> lastEnemyHeadings = new Dictionary<int, double>();
    static void Main(string[] args)
    {
        new BotSatu().Start();
    }

    BotSatu() : base(BotInfo.FromFile("BotSatu.json")) { }

    public override void Run()
    {
        /* Customize bot colors, read the documentation for more information */
        BodyColor = Color.Gray;

        // Supaya setiap komponen independen
        AdjustGunForBodyTurn = true;
        AdjustRadarForGunTurn = true;
        AdjustRadarForBodyTurn = true;

        SetTurnRadarLeft(Double.PositiveInfinity);
        while (IsRunning)
        {
            FindSafestDirection();
        }
    }

    public override void OnScannedBot(ScannedBotEvent e)
    {
        int idx = scannedBot.FindIndex(a => a.ScannedBotId == e.ScannedBotId);
        if (idx != -1)
        {
            scannedBot[idx] = e;
        }
        else
        {
            scannedBot.Add(e);
        }

        if (EnemyCount < 2)
        {
            FireCircular(e);
        }
    }

    public override void OnBotDeath(BotDeathEvent e)
    {
        scannedBot.RemoveAll(bot => bot.ScannedBotId == e.VictimId);
    }

    public override void OnHitBot(HitBotEvent e)
    {
        Console.WriteLine("Ouch! I hit a bot at " + e.X + ", " + e.Y);

        double currentX = this.X;
        double currentY = this.Y;
        double currentGunDirection = this.GunDirection;

        double targetDirection = CalcDegree(currentX, currentY, e.X, e.Y);
        double deltaDirection = NormalizeBearing(targetDirection - currentGunDirection);

        TurnGunLeft(deltaDirection);
        Fire(3.00D);
    }

    public override void OnHitWall(HitWallEvent e)
    {
        TurnLeft(90.00D); // Turn 180
        Console.WriteLine("Ouch! I hit a wall, must turn back!");
    }

    private void FindSafestDirection()
    {
        double vectorX = 0;
        double vectorY = 0;

        foreach (ScannedBotEvent b in scannedBot)
        {
            double enemyCoordinateX = b.X;
            double enemyCoordinateY = b.Y;
            double enemyDistance = DistanceTo(enemyCoordinateX, enemyCoordinateY);

            double deltaX = this.X - enemyCoordinateX;
            double deltaY = this.Y - enemyCoordinateY;
            double distanceSq = Math.Max(100, enemyDistance * enemyDistance);

            vectorX += deltaX / distanceSq;
            vectorY += deltaY / distanceSq;
        }

        double wallMargin = 100;
        double width = this.ArenaWidth;
        double height = this.ArenaHeight;

        if (this.X < wallMargin) vectorX += 1;
        if (this.X > width - wallMargin) vectorX -= 1;
        if (this.Y < wallMargin) vectorY += 1;
        if (this.Y > height - wallMargin) vectorY -= 1;

        double mag = Math.Sqrt((vectorX * vectorX) + (vectorY * vectorY));
        if (mag > 0)
        {
            vectorX = (vectorX / mag) * 100;
            vectorY = (vectorY / mag) * 100;
        }

        double safeX = Math.Max(100, Math.Min(width - 100, this.X + vectorX));
        double safeY = Math.Max(100, Math.Min(height - 100, this.Y + vectorY));

        Console.WriteLine("safestX: " + safeX);
        Console.WriteLine("safestY: " + safeY);

        goTo(safeX, safeY);
    }

    public void goTo(double targetX, double targetY)
    {
        double currentX = this.X;
        double currentY = this.Y;
        double currentDirection = this.Direction;

        double targetDirection = CalcDegree(currentX, currentY, targetX, targetY);
        double deltaDirection = NormalizeBearing(targetDirection - currentDirection);

        SetTurnLeft(deltaDirection);
        Forward(100.00D);
        Console.WriteLine("Done !!!");
    }

    public double CalcDegree(double x1, double y1, double x2, double y2)
    {
        double dx = x2 - x1;
        double dy = y2 - y1;
        double radians = Math.Atan2(dy, dx);
        double degrees = radians * (180.0 / Math.PI);
        degrees = (degrees + 360) % 360;
        return degrees;
    }

    private double NormalizeBearing(double angle)
    {
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        return angle;
    }

    public void FireCircular(ScannedBotEvent e)
    {
        double enemyX = e.X;
        double enemyY = e.Y;
        double enemySpeed = e.Speed;
        double enemyHeading = e.Direction;
        double bulletPower = CalcBulletPower(enemyX, enemyY);
        double bulletSpeed = CalcBulletSpeed(bulletPower);
        double distance = DistanceTo(enemyX, enemyY);
        double timeToImpact = distance / bulletSpeed;

        double angularVelocity = 0;
        if (lastEnemyHeadings.ContainsKey(e.ScannedBotId))
        {
            angularVelocity = NormalizeBearing(enemyHeading - lastEnemyHeadings[e.ScannedBotId]);
        }
        lastEnemyHeadings[e.ScannedBotId] = enemyHeading;

        double predictedX = enemyX;
        double predictedY = enemyY;
        double predictedHeading = enemyHeading;

        for (int i = 0; i < (int)timeToImpact; i++)
        {
            predictedHeading += angularVelocity;
            predictedX += Math.Cos(predictedHeading * (Math.PI / 180.0)) * enemySpeed;
            predictedY += Math.Sin(predictedHeading * (Math.PI / 180.0)) * enemySpeed;
        }

        double targetAngle = CalcDegree(this.X, this.Y, predictedX, predictedY);
        double deltaAngle = NormalizeBearing(targetAngle - this.GunDirection);

        TurnGunLeft(deltaAngle);
        Fire(bulletPower);
    }

    public double CalcBulletPower(double targetX, double targetY)
    {
        double distance = DistanceTo(targetX, targetY);

        if (distance < 100)
        {
            return 2.50D;
        }
        else if (distance < 300)
        {
            return 1.50D;
        }
        else if (distance < 500)
        {
            return 1.20D;
        }
        else if (distance < 700)
        {
            return 1.00D;
        }
        else { return 0.5D; }
    }

}