using System;
using System.Drawing;
using System.Collections.Generic;
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;

public class NearestBot : Bot
{
    /* Lowest Energy Bot */
    private List<ScannedBotEvent> scannedBot = new List<ScannedBotEvent>();
    private Dictionary<int, double> lastEnemyHeadings = new Dictionary<int, double>();
    static void Main(string[] args)
    {
        new NearestBot().Start();
    }

    NearestBot() : base(BotInfo.FromFile("NearestBot.json")) { }

    public override void Run()
    {
        /* Warna Bot */
        BodyColor = Color.FromArgb(255, 255, 255);
        TurretColor = Color.FromArgb(255, 0, 0);
        RadarColor = Color.FromArgb(255, 0, 0);
        BulletColor = Color.FromArgb(0, 255, 0);
        ScanColor = Color.FromArgb(255, 0, 0);
        TracksColor = Color.FromArgb(255, 255, 255);
        GunColor = Color.FromArgb(255, 0, 0);

        // Supaya setiap komponen independen
        AdjustGunForBodyTurn = true;
        AdjustRadarForGunTurn = true;
        AdjustRadarForBodyTurn = true;

        SetTurnRadarLeft(Double.PositiveInfinity);
        while (IsRunning)
        {
            RandomMove();
            Fire2();
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
    }

    public override void OnHitBot(HitBotEvent e)
    {
        Console.WriteLine("Ouch! I hit a bot at " + e.X + ", " + e.Y);
    }

    public override void OnBotDeath(BotDeathEvent e)
    {
        scannedBot.RemoveAll(bot => bot.ScannedBotId == e.VictimId);
    }

    public override void OnHitWall(HitWallEvent e)
    {
        TurnLeft(90.00D); // Turn 180
        Console.WriteLine("Ouch! I hit a wall, must turn back!");
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

    private double NormalizeBearing(double angle)
    {
        while (angle > 180) angle -= 360;
        while (angle < -180) angle += 360;
        return angle;
    }

    public void Fire2()
    {
        ScannedBotEvent target = GetClosestTarget();
        if (target == null) return; // Kalau tidak ada target, tidak perlu menembak
        Console.WriteLine(target.ScannedBotId);

        double distance = DistanceTo(target.X, target.Y);
        double firePower = CalcBulletPower(target.X, target.Y);

        double targetAngle = CalcDegree(this.X, this.Y, target.X, target.Y);
        double deltaAngle = NormalizeBearing(targetAngle - this.GunDirection);

        TurnGunLeft(deltaAngle);
        Fire(firePower);
    }

    public ScannedBotEvent GetClosestTarget()
    {
        if (scannedBot.Count == 0)
            return null; // Tidak ada musuh yang terdeteksi

        ScannedBotEvent closestBot = scannedBot[0];
        double minDistance = DistanceTo(closestBot.X, closestBot.Y);

        foreach (ScannedBotEvent bot in scannedBot)
        {
            double distance = DistanceTo(bot.X, bot.Y);
            if (distance < minDistance)
            {
                minDistance = distance;
                closestBot = bot;
            }
        }

        return closestBot;
    }

    public void RandomMove()
    {
        double moveDistance = 100 + (new Random()).Next(100); // Antara 100-200 unit
        Forward(moveDistance);
        TurnLeft(30 + (new Random()).Next(60)); // Putar antara 30-90 derajat
    }

    ///* Read the documentation for more events and methods */
}