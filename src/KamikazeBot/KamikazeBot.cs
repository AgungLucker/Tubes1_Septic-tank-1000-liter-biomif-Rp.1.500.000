using System;
using System.Drawing;
using System.Collections.Generic;  
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;
using Robocode.TankRoyale.BotApi.Util;

public class KamikazeBot : Bot
{
    private int currTurn;
    private int LastScannedTurn;
    private int  TargetID;
    private double TargetX;
    private double TargetY;
    private bool IsTempEscape;
    private double HighestEnergy;
    private bool Banzai;
    private Dictionary<int, bool> scannedBots = new Dictionary<int, bool>();

    private int HitByBot;

    static void Main(string[] args)
    {
        new KamikazeBot().Start();
    }

    KamikazeBot() : base(BotInfo.FromFile("KamikazeBot.json")) { }

    public override void Run()
    {
        BodyColor = Color.FromArgb(255, 255, 255); 
        TurretColor = Color.FromArgb(255, 0, 0);   
        RadarColor = Color.FromArgb(255, 0, 0);
        BulletColor = Color.FromArgb(0, 255, 0); 
        ScanColor = Color.FromArgb(255, 0, 0);
        TracksColor = Color.FromArgb(255, 255, 255);
        GunColor = Color.FromArgb(255, 0, 0);

        currTurn = 0;
        LastScannedTurn = 0;
        TargetID = -1;
        TargetX = 0;
        TargetY = 0;
        HitByBot = 0;
        HighestEnergy = -1; 

        TargetSpeed = 2;
        IsTempEscape = false;
        Banzai = false;

        while (IsRunning)
        {
            currTurn++;
            Console.WriteLine($"HasTarget: {TargetID}"); // Print status target
            Console.WriteLine($"isBanzai: {Banzai}"); 

            DefaultMove();

            if (TargetID == -1 || !Banzai) {
                SetTurnRadarRight(45.00D); 
                Console.WriteLine("Bot is scanning");
            } else if (Banzai) {
                if ((currTurn - LastScannedTurn) > 5) {
                    SetTurnRadarRight(360);
                }
            }
            Go();
        }
    }

    public override void OnScannedBot(ScannedBotEvent e)
    {     

        Console.WriteLine("OnscannedBot");
        Console.WriteLine($"iD: {e.ScannedBotId}");
        Console.WriteLine($"max Energy: {HighestEnergy}"); 
        Console.WriteLine($" Enemy Energy: {e.Energy}, id = {e.ScannedBotId}"); 
        if (Banzai == false && currTurn > 60) {
            Console.WriteLine($"max Energy: {HighestEnergy}"); 
            Console.WriteLine($" Enemy Energy: {e.Energy}, id = {e.ScannedBotId}"); 
            Console.WriteLine($"Count: {scannedBots.Count}");
            if (!scannedBots.ContainsKey(e.ScannedBotId))
            {
                scannedBots[e.ScannedBotId] = true;
            }
            bool allBotsScanned = (scannedBots.Count == EnemyCount);
            if ((TargetID == -1 && e.Energy < 90) || ((e.Energy > HighestEnergy) && e.Energy < 90))  {
                if (e.Energy > HighestEnergy) {
                    HighestEnergy = e.Energy;
                }
                Console.WriteLine("NOT BANZAI");
                LockTarget(e);
            } else if ((TargetID == e.ScannedBotId && allBotsScanned) || EnemyCount == 1) {
                if (EnemyCount == 1) {
                    LockTarget(e);
                }
                Console.WriteLine("BANZAI");
                Banzai = true;
                SetTurnRadarRight(360);
            }
        }

        // Tracking bot musuh
        if (e.ScannedBotId == TargetID && Banzai == true) {
            scannedBots.Clear();
            TargetX = e.X;
            TargetY = e.Y; 
            double distance = DistanceTo(e.X, e.Y);
            double radarTurn = RadarBearingTo(e.X, e.Y);
            SetTurnRadarLeft(radarTurn * 2); //Radar lock in kalau bot lemah
            Console.WriteLine("Scanning");
            TurnToFaceTarget(TargetX, TargetY);
            SetForward(distance + 5);
            TurnGunToFaceTarget(TargetX, TargetY);

            FireByDistance();
            Go();
        } 
          
        
    }

    // Ketika bertabrakan dengan bot lain
    public override void OnHitBot(HitBotEvent e)
    {
        HitByBot++;

        if (!IsTempEscape) {
            if ((HitByBot > 1 && DistanceTo(TargetX, TargetY) > 20) || (DistanceTo(TargetX, TargetY) > 80 && Banzai) || TargetID == -1) {
                Console.WriteLine("DI GANGBANG GINI CIK");
                IsTempEscape = true;
                Back(80);
                SetTurnLeft(60);
                SetTurnRadarRight(360);
                Go(); 
                
            } else {
                TargetX = e.X;
                TargetY = e.Y;
                double radarTurn = RadarBearingTo(e.X, e.Y);
                SetTurnRadarLeft(radarTurn * 2); //Radar lock in kalau bot lemah
                TurnToFaceTarget(e.X, e.Y);
                TurnGunToFaceTarget(e.X, e.Y);    
                FireByEnergy(e);
                SetForward(40); 
                Go(); 
            }
            ClearEvents();
        }
    }
    public override void OnBotDeath(BotDeathEvent e)
    {
        ResetTarget();
        Console.WriteLine("Omae wa mo shindeiru");
        SetBack(120);
        SetTurnRight(120); 
        SetTurnRadarRight(360);
        Go();
        ClearEvents();
    }
    // Ketika bot kena tembok
    public override void OnHitWall(HitWallEvent e)
    {
        Console.WriteLine("bot hit wall");
        SetBack(100);
        SetTurnRight(90); 
        SetTurnRadarRight(360);
        Go();
    }

    public override void OnTick(TickEvent tickEvent)
    {   
        if (IsTempEscape) {
            Console.WriteLine("Escape finished");
            IsTempEscape = false;
        }
        HitByBot = 0;
    }

    
    private void TurnToFaceTarget(double x, double y)
    {
        Console.WriteLine("bot face target");
        var bearing = BearingTo(x, y);
        if (Math.Abs(bearing) > 120) { 
            // Console.WriteLine("low speed"); 
            TargetSpeed = 3;  
        } else if (Math.Abs(bearing) > 30 && Math.Abs(bearing) < 120) {
            // Console.WriteLine("medium speed"); 
            TargetSpeed = 5;  
        }
        else { 
            TargetSpeed = 8; 
        }
        SetTurnLeft(bearing); 
    }

    // Putar turret ke musuh
    private void TurnGunToFaceTarget(double x, double y)
    {
        Console.WriteLine("gun face target");
        var gunBearing = GunBearingTo(x, y);
        SetTurnGunLeft(gunBearing); 
    }

    private void LockTarget(ScannedBotEvent e) {
        TargetID = e.ScannedBotId;
        TargetX = e.X;
        TargetY = e.Y;     
    }

    private void ResetTarget() {
        Console.WriteLine("target reset");
        Banzai = false;
        TargetID = -1;
        TargetX = 0;
        TargetY = 0;
        TargetSpeed = 3;
        HighestEnergy = 0;
    }

    private void FireByEnergy(HitBotEvent e) {
        if (e.Energy > 8) {
            Console.WriteLine("pew pew 3");
            Fire(3);
        }
        else if (e.Energy > 4) {
            Fire(2);
        }
        else if (e.Energy > 2) {
            Fire(1);
        }
        else if (e.Energy > .4) {
            Fire(.1);
        }
    }

    private void FireByDistance()  {
        if (DistanceTo(TargetX, TargetY) >= 180) {
            Fire(0.7);
        } else if (DistanceTo(TargetX, TargetY) > 50 && DistanceTo(TargetX, TargetY) < 180) {
            Fire(2);
        } else if (DistanceTo(TargetX, TargetY) <= 50){
            Console.WriteLine("BOOM");
            Fire(3);
        }
    }

    private void DefaultMove() {
        if (currTurn > 60) {
            Console.WriteLine("YES");
            SetForward(80);
            SetTurnRight(40);
        } else {
            Console.WriteLine("No");
            double centerX = ArenaWidth / 2;
            double centerY = ArenaHeight / 2;
            double bearingToCenter = BearingTo(centerX, centerY);
            double distanceToCenter = DistanceTo(centerX, centerY);
            if (DistanceTo(centerX, centerY) > 20) {
                SetTurnLeft(bearingToCenter);
                SetForward(distanceToCenter);
            } else {
                SetForward(80);
                SetTurnRight(40);
            }
        }
    }
}