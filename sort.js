
$(document).ready(function() {
  $("textarea").on('paste', function(e) {
    setTimeout(function(e) {
      var stories = $("textarea").val().trim().replace(/^\* /, "")
        .split(/\n+\* |\r+\* |\(\r\n\)+\* /g);
      if (stories.length > 1) {
        showSortTool(true);
        insertSort(stories, 0, 1, []);
      }
    }, 100);
  });
});

function insertSort(stories, sortedIndex, insertIndex, undoStack) {
  display(stories, sortedIndex, insertIndex);

  if (insertIndex == stories.length) {
    finish(stories);
    return;
  }

  $("#undo").off().click(function() {
    if (undoStack.length == 0) return;
    if (insertIndex < sortedIndex + 1) {
      insertIndex = shiftInsert(stories, insertIndex, 1);
    } else {
      --sortedIndex;
      insertIndex = undoStack.pop();
      if (insertIndex == sortedIndex || insertIndex == 0) {
        insertIndex = shiftInsert(stories, insertIndex, 1);
      }
    }
    insertSort(stories, sortedIndex, insertIndex, undoStack);
    return false;
  });

  $("#done").off().click(function() {
    finish(stories);
    return
  });

  $("#option1").off().prop("title", stories[insertIndex - 1])
    .val(stories[insertIndex - 1].replace(/\n.*/g, ""))
    .click(function() {
      undoStack.push(insertIndex);
      insertSort(stories, sortedIndex + 1, sortedIndex + 2, undoStack);
    });

  $("#option2").off().prop("title", stories[insertIndex])
    .val(stories[insertIndex].replace(/\n.*/g, ""))
    .click(function() {
      insertIndex = shiftInsert(stories, insertIndex, -1);
      if (insertIndex == 0) {
        undoStack.push(0);
        sortedIndex++;
        insertIndex = sortedIndex + 1;
      }
      insertSort(stories, sortedIndex, insertIndex, undoStack);
    });
}

function shiftInsert(stories, insertIndex, direction) {
  stories.splice(insertIndex + direction, 0, stories.splice(insertIndex, 1)[0]);
  return insertIndex + direction;
}

function display(stories, sortedIndex, insertIndex) {
  $("#backlog").empty();
  $.each(stories, function(index, value) {
    var clazz = index == insertIndex ? "insert" :
               (index <= sortedIndex + 1 ? "sorted" : null);
    $("#backlog").append($("<div>").addClass(clazz)
      .text(value.replace(/\n.*/g, "")));
  });
}

function finish(stories) {
  showSortTool(false);
  $("textarea").val("* " + stories.join("\n* "));
}

function showSortTool(show) {
  $("#sorttool").toggle(show);
  $("#setup").toggle(!show);
}
