module.exports = {
  levenshteinDistance(source, target) {
    var result = []; // This is going to be a matrix. The result we're looking for can be found by flood-filling it.
    var i, j;
  
    // Let's fill the first line of the matrix with distances from each substring of the source to the empty string.
    for (i = 0; i <= source.length; i++) {
      result.push([i]);
    }
  
    // Same as above, but for a column. Also, the first element of the first column is already filled with a zero, hence j = 1.
    for (j = 1; j <= target.length; j++) {
      result[0].push(j);
    }
  
    for (i = 1; i <= source.length; i++) {
      for (j = 1; j <= target.length; j++) {
  
        // the element in the iteration doesn't exist yet. Let's create it.
        result[i].push(0);
  
        // Now let's get an edit distance between two characters.
        if (source[i - 1] == target[j - 1]) {
  
          // Notice how, for a comparison between two equal strings, the diagonal will be filled with zeroes.        
          result[i][j] = result[i - 1][j - 1];
        } else {
  
          // Different characters. The formulae for edit distances are shown below.
          var minimum = Math.min(
            result[i - 1][j] + 1, // This means we can bring the target string closer to the source one with a character deletion
            result[i][j - 1] + 1  // Same as above, but with a character insertion
          );
  
          minimum = Math.min(
            minimum,
            result[i - 1][j - 1] + 1 // This means that we can bring the target closer to the source by means of a character change.
          );
          result[i][j] = minimum;
        }
      }
    }
  
    // The actual distance we're looking for is the value stored in the lower right corner of the matrix.
    return result[source.length][target.length];
  }
}