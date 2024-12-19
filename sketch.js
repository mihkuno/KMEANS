let points = [];
let centroids = [];
let k = 4; // Number of clusters
let iterations = 0;

function setup() {
  createCanvas(1200, 900);

  // Generate random points
  for (let i = 0; i < 500; i++) {
    points.push({
      x: random(width),
      y: random(height),
      cluster: -1
    });
  }

  // Initialize centroids randomly
  for (let i = 0; i < k; i++) {
    centroids.push({
      x: random(width),
      y: random(height)
    });
  }
}

function draw() {
  background(30);
  noStroke();

  // Draw centroids
  for (let i = 0; i < centroids.length; i++) {
    fill(255, 0, 0);
    square(centroids[i].x, centroids[i].y, 20);
  }

  // Draw points
  for (let i = 0; i < points.length; i++) {
    if (points[i].cluster !== -1) {
      fill(colorForCluster(points[i].cluster));
    } else {
      fill(255);
    }
    ellipse(points[i].x, points[i].y, 15, 15);
  }

  // Run one step of K-Means clustering
  if (iterations < 20) {
    if (frameCount % 30 === 0) {
      kMeansStep();
      iterations++;
    }
  }
}

// Assign points to nearest centroid
function assignClusters() {
  for (let i = 0; i < points.length; i++) {
    let minDist = Infinity;
    let bestCluster = -1;
    for (let j = 0; j < centroids.length; j++) {
      let d = dist(points[i].x, points[i].y, centroids[j].x, centroids[j].y);
      if (d < minDist) {
        minDist = d;
        bestCluster = j;
      }
    }
    points[i].cluster = bestCluster;
  }
}

// Update centroid positions based on assigned points
function updateCentroids() {
  let sums = new Array(k).fill(0).map(() => ({ x: 0, y: 0, count: 0 }));

  for (let i = 0; i < points.length; i++) {
    let cluster = points[i].cluster;
    sums[cluster].x += points[i].x;
    sums[cluster].y += points[i].y;
    sums[cluster].count++;
  }

  for (let i = 0; i < centroids.length; i++) {
    if (sums[i].count > 0) {
      centroids[i].x = sums[i].x / sums[i].count;
      centroids[i].y = sums[i].y / sums[i].count;
    }
  }
}

// Perform one iteration of K-Means
function kMeansStep() {
  assignClusters();
  updateCentroids();
}

// Utility function to assign colors to clusters
function colorForCluster(cluster) {
  const colors = [
    color(0, 255, 0),
    color(0, 0, 255),
    color(255, 255, 0),
    color(255, 0, 255),
    color(0, 255, 255)
  ];
  return colors[cluster % colors.length];
}
