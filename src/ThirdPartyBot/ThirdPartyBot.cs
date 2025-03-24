using System;
using System.Collections.Generic;
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;
using System.Linq;

public class ThirdPartyBot : Bot {
    private int gridWidthScaling;
    private int gridHeightScaling;

    internal Dictionary<(int, int), List<(double, double)>> playerZoneLoc = new Dictionary<(int, int), List<(double, double)>>();
    private TooNearWallCondition NearWallCond;
    private WallPanic panicWall;

    double distanceToLeftWall ;
    double distanceToRightWall ;
    double distanceToBottomWall ;
    double distanceToTopWall ;

    //Avoid Wall Flag
    private bool wasPanicked = false;
    private bool isTurningAwayFromWall;
    private bool isNearHorizontalWall = false;
    private bool isNearWall = false;

    public ThirdPartyBot() : base(BotInfo.FromFile("ThirdPartyBot.json")) {
        NearWallCond =  new TooNearWallCondition(this);
        panicWall = new WallPanic(this);
    }

    static void Main(string[] args) => new ThirdPartyBot().Start();

    private double getPantulHorizontal(double sudutAwal) {
        double sudutPantul = 0;
        if (sudutAwal > 180 && sudutAwal < 270) {
            sudutPantul = (180 - 2 * (270 - sudutAwal));
        }
        else if (sudutAwal < 180 && sudutAwal > 90) {
            sudutPantul = 180 - 2 * (sudutAwal - 90);
            sudutPantul = -sudutPantul;
        }
        else if (sudutAwal < 90) {
            sudutPantul = 180 - 2 * (90 - sudutAwal);
        }
        else if (sudutAwal > 270 && sudutAwal < 360) {
            sudutPantul = 180 - 2 * (sudutAwal - 270);
            sudutPantul = -sudutPantul; 
        }
        return sudutPantul;
    }

    private double getPantulVertical(double sudutAwal) {
        double sudutPantul = 0;
        if (sudutAwal > 180 && sudutAwal < 270) {
            sudutPantul = 180 - 2 * (sudutAwal - 180);
            sudutPantul = -sudutPantul; 
        }
        else if (sudutAwal < 180 && sudutAwal > 90) {
            sudutPantul = 180 - 2 * (180 - sudutAwal);
        }
        else if (sudutAwal < 90) {
            sudutPantul = -(180 - 2 * (sudutAwal));
        }
        else if (sudutAwal > 270 && sudutAwal < 360) {
            sudutPantul = 180 - 2 * (360 - sudutAwal );
        }
        return sudutPantul;
    }

    public override void OnHitWall(HitWallEvent e) {
        double nearestWall = Math.Min(distanceToBottomWall, Math.Min(distanceToLeftWall, Math.Min(distanceToRightWall, distanceToTopWall)));
        Back(80);
        
        double turnAngle = 0;
        if (distanceToBottomWall == nearestWall) {
            if (Direction > 180 && Direction < 270) {
                turnAngle = 45; 
            } else {
                turnAngle = -45; 
            }
        } 
        else if (distanceToLeftWall == nearestWall) {
            if (Direction < 180 && Direction >90) {
                turnAngle = 45;
            } else {
                turnAngle = -45; 
            }
        } 
        else if (distanceToRightWall == nearestWall) {
            if (Direction > 0 && Direction <90) {
                turnAngle = -45;
            } else {
                turnAngle = 45;
            }
        } 
        else if (distanceToTopWall == nearestWall) {
            if (Direction > 0 && Direction <90) {
                turnAngle = 45; 
            } else {
                turnAngle = -45; 
            }
        }
        SetTurnRight(turnAngle);
        SetTurnRadarRight(720);
        Forward(100);
    }


    public override void OnGameStarted(GameStartedEvent e) {
        base.OnGameStarted(e);

        AddCustomEvent(new TooNearWallCondition(this));
        AddCustomEvent(new WallPanic(this));

        gridWidthScaling = (int)(ArenaWidth / 3);
        gridHeightScaling = (int)(ArenaHeight / 3);

        for (int x = 0; x < 3; x++) {
            for (int y = 0; y < 3; y++) {
                playerZoneLoc[(x, y)] = new List<(double, double)>();
            }
        }
    }

    public override void OnHitBot(HitBotEvent e){
        MaxSpeed = 6;

        // Hitung arah tabrakan
        double tertabrak = CalcDegree(X, Y, e.X, e.Y);
        double delta = (tertabrak - Direction + 360) % 360;

        Console.WriteLine($"Musuh NABRAK DI ARAH {tertabrak}");
        Console.WriteLine($"Posisi SAYA DI ARAH {Direction}");

        // Menentukan arah menghindar
        if (delta >= 0 && delta < 90){
            Console.WriteLine("Musuh di Depan Kiri");
            SetTurnRight(90);
        }
        else if (delta >= 90 && delta < 180) {
            Console.WriteLine("Musuh di Depan Kanan");
            SetTurnLeft(90);
        }
        else if (delta >= 180 && delta < 225){
            Console.WriteLine("Musuh di Belakang Kiri");
            SetTurnRight(90);
        }
        else if (delta >= 225 && delta < 315){
            Console.WriteLine("Musuh di Belakang Kanan");
            SetTurnLeft(90);
        }
        else  {
            Console.WriteLine("Musuh langsung di belakang");
            SetTurnRight(60);
        }
        MaxSpeed = 8;
    }

    

    public override void OnScannedBot(ScannedBotEvent e) {
        double enemyPosX = e.X;
        double enemyPosY = e.Y;
        int enemyZoneX = (int)(enemyPosX / gridWidthScaling);
        int enemyZoneY = (int)(enemyPosY / gridHeightScaling);

        playerZoneLoc[(enemyZoneX, enemyZoneY)].Add((enemyPosX, enemyPosY)); //update data
    }

    private void cleanUpData(){
        foreach (var key in playerZoneLoc.Keys.ToList()) {
            playerZoneLoc[key].Clear();
        }
    }

    public override void Run() {
        BodyColor = Color.FromArgb(0x00, 0x00, 0x00);
        TurretColor = Color.FromArgb(0x00, 0x00, 0x00);
        RadarColor = Color.FromArgb(0x00, 0x00, 0x00);
        BulletColor = Color.FromArgb(0x00, 0x00, 0x00);
        ScanColor = Color.FromArgb(0x00, 0x00, 0x00);
        TracksColor = Color.FromArgb(0x00, 0x00, 0x00);
        GunColor = Color.FromArgb(0x00, 0x00, 0x00);

        AdjustGunForBodyTurn =true ;
        AdjustRadarForGunTurn = true;
        while (IsRunning) {

            isNearWall = NearWallCond.Test();
            distanceToLeftWall = X;
            distanceToRightWall = ArenaWidth - X;
            distanceToBottomWall = Y;
            distanceToTopWall = ArenaHeight - Y;
            double closestDistance = Math.Min(
                Math.Min(distanceToLeftWall, distanceToRightWall),
                Math.Min(distanceToBottomWall, distanceToTopWall)
            );
            
         
            if (closestDistance == distanceToLeftWall || closestDistance == distanceToRightWall) {
                isNearHorizontalWall = false;
            } else {
                isNearHorizontalWall = true;
            }

            if (isNearWall && !isTurningAwayFromWall && !panicWall.Test()) { 
                MaxSpeed = 6; 
                isTurningAwayFromWall = true;
                OnCustomEvent(new CustomEvent(5, NearWallCond));
            } 

            if (panicWall.Test() && !wasPanicked) {
                wasPanicked = true;
                MaxSpeed = 3;
                OnCustomEvent(new CustomEvent(10, panicWall));
            } 
            if (!panicWall.Test()) {
                MaxSpeed = 6;
                wasPanicked = false;
            }

            if (!NearWallCond.Test() && isTurningAwayFromWall) {
                Console.WriteLine("Balik Kesemula");
                MaxSpeed = 8;
                isTurningAwayFromWall = false;
            }

            if (TurnNumber % 8 == 0) {
                List<(double, double)> zoneTerbanyak = new List<(double, double)>();
                int count = 0;
                (int, int) nearestZone = (0, 0); 
                double minDistance = double.MaxValue; 
                
                foreach (var key in playerZoneLoc.Keys.ToList()) {
                    int playerCount = playerZoneLoc[key].Count();
                    double distance = Math.Pow(key.Item1 - X/gridWidthScaling, 2) + Math.Pow(key.Item2 - Y/gridHeightScaling, 2); 
                    
                    if (playerCount > count || (playerCount == count && distance < minDistance)) {
                        count = playerCount;
                        minDistance = distance;
                        nearestZone = key;
                        zoneTerbanyak = playerZoneLoc[key];
                    }
                }

                if (zoneTerbanyak.Count > 0) {
                    double minDistancePlayer = double.MaxValue;
                    double playerX = 0;
                    double playerY = 0;

                    foreach ((double, double) player in zoneTerbanyak) {
                        double distancePlayer = Math.Pow(player.Item1 - X, 2) + Math.Pow(player.Item2 - Y, 2);

                        if (distancePlayer < minDistancePlayer) {
                            minDistancePlayer = distancePlayer;
                            playerX = player.Item1;
                            playerY = player.Item2;
                        }
                    }

                    double targetDirection = CalcDegree(X,Y,playerX, playerY); 
                    Console.WriteLine($"Musuh diarah {targetDirection}");
                    double deltaDirection = CalcGunBearing(targetDirection);
                    Console.WriteLine($"Delta direction buat gun {deltaDirection}");
                    TurnGunLeft(deltaDirection);                
                }
                Fire(2);
                cleanUpData();
                SetTurnRadarRight(360);
            }

            // Perintah gerakan utama
            SetForward(20);
            Go();
        }

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

    public override void OnCustomEvent(CustomEvent e) {

        if (e.Condition.Name == "WallVeryClose"){
            double sudutPantulPanic = 0;
            int myHitRobotPriority = GetEventPriority(e.GetType());
            if (isNearHorizontalWall) {
                sudutPantulPanic =  getPantulHorizontal(Direction)>170 ? getPantulHorizontal(Direction) * 0.9:getPantulHorizontal(Direction) ;
                SetTurnRight(sudutPantulPanic);
            }
            else {
                sudutPantulPanic = getPantulVertical(Direction) > 170 ?  getPantulVertical(Direction) * 0.9: getPantulVertical(Direction) ;
                SetTurnRight(sudutPantulPanic); 
            }
            MaxSpeed = 4;
            SetForward(200);

        }
        else if (e.Condition.Name == "TooNearWithWall") {
            double sudutPantul = 0;
            int myHitRobotPriority = GetEventPriority(e.GetType());
            if (isNearHorizontalWall) {
                sudutPantul =  getPantulHorizontal(Direction) >170 ? getPantulHorizontal(Direction) * 0.9:getPantulHorizontal(Direction) ;
                SetTurnRight(sudutPantul);
            }
            else {
                sudutPantul = getPantulVertical(Direction) >170 ? getPantulVertical(Direction) * 0.9:getPantulVertical(Direction) ;
                SetTurnRight(sudutPantul);
            }
            
            SetForward(200);
            Go();
        }
    }
}

// Event untuk mendeteksi jika bot terlalu dekat dengan dinding
public class TooNearWallCondition : Condition {
    private Bot bot;
    private const int WallMargin = 100; 

    public TooNearWallCondition(Bot bot) : base("TooNearWithWall") {
        this.bot = bot;
    }

    public override bool Test() {

        bool isNearWall = bot.X < WallMargin || bot.X > bot.ArenaWidth - WallMargin ||
                            bot.Y < WallMargin || bot.Y > bot.ArenaHeight - WallMargin;

        Console.WriteLine($"[DEBUG] TooNearWallCondition Test: {isNearWall}");
        return isNearWall;
    }
}

public class WallPanic : Condition {
    private ThirdPartyBot bot;
    private const int panicDistance = 40; 

    public WallPanic(ThirdPartyBot bot) : base("WallVeryClose") {
        this.bot = bot;
    }

    public override bool Test() {

        bool isNearWall = bot.X < panicDistance || bot.X > bot.ArenaWidth - panicDistance ||
                            bot.Y < panicDistance || bot.Y > bot.ArenaHeight - panicDistance;

        Console.WriteLine($"[DEBUG] WALLPANIC Test: {isNearWall}");
        return isNearWall;
    }


}


