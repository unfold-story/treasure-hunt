// 在原 treasure.js Promise 版本基础上扩展
class TreasureMap {
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getInitialClue() {
    await this.delay(900);
    return "在古老的图书馆里找到了第一张羊皮纸线索。";
  }

  static async decodeAncientScript(clue) {
    await this.delay(1200);
    if (!clue) throw new Error("没有线索可以解码！");
    return "古文解码成功：宝藏藏在北方失落神庙深处。";
  }

  // 新情节 1：穿越迷雾石桥
  static async crossFogBridge(location) {
    await this.delay(1300);
    if (!location) throw new Error("没有目标地点，无法继续前进！");
    return "借助羊皮纸上的星图，成功穿过迷雾石桥。";
  }

  static async searchTemple(location) {
    await this.delay(1500);
    // 保留原作“可能失败”的随机事件，但把失败概率降低到 25%
    if (Math.random() < 0.25) {
      throw new Error("神庙守卫发现了你，寻宝失败！");
    }
    return "避开守卫后，在神庙大厅发现了一扇机关石门。";
  }

  // 新情节 2：破解机关
  static async solvePuzzle() {
    await this.delay(1300);
    return "依次点亮太阳、月亮与星辰符号，机关石门缓缓打开。";
  }

  static async openTreasureBox() {
    await this.delay(1000);
    return "恭喜！你找到了传说中的黄金罗盘和失落王冠！";
  }
}

const startBtn = document.querySelector("#startBtn");
const log = document.querySelector("#log");
const progressText = document.querySelector("#progressText");
const hero = document.querySelector("#hero");
const toast = document.querySelector("#toast");
const stages = [...document.querySelectorAll(".stage")];

const positions = [
  { left: "9%", top: "50%" },
  { left: "25%", top: "35%" },
  { left: "42%", top: "61%" },
  { left: "59%", top: "36%" },
  { left: "76%", top: "61%" },
  { left: "92%", top: "50%" }
];

function writeLog(text, type = "") {
  const p = document.createElement("p");
  p.textContent = `> ${text}`;
  if (type) p.className = type;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function setStage(index) {
  stages.forEach((stage, i) => {
    stage.classList.toggle("active", i === index);
    stage.classList.toggle("done", i < index);
  });
  if (positions[index]) {
    hero.style.left = positions[index].left;
    hero.style.top = positions[index].top;
  }
  progressText.textContent = `进度 ${index + 1} / ${stages.length}`;
}

function resetUI() {
  log.innerHTML = "";
  stages.forEach((stage, i) => {
    stage.classList.toggle("active", i === 0);
    stage.classList.remove("done");
  });
  hero.style.left = positions[0].left;
  hero.style.top = positions[0].top;
  progressText.textContent = "正在寻宝";
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// 使用 async / await 重写完整寻宝流程
async function findTreasureWithAsyncAwait() {
  resetUI();
  startBtn.disabled = true;
  startBtn.textContent = "寻宝进行中...";

  try {
    setStage(0);
    writeLog("进入古老图书馆，正在寻找线索……", "system");
    const clue = await TreasureMap.getInitialClue();
    writeLog(clue, "success");

    setStage(1);
    writeLog("开始解读羊皮纸上的古老文字……", "system");
    const location = await TreasureMap.decodeAncientScript(clue);
    writeLog(location, "success");

    setStage(2);
    writeLog("前方出现迷雾石桥，正在寻找安全路线……", "system");
    const bridge = await TreasureMap.crossFogBridge(location);
    writeLog(bridge, "success");

    setStage(3);
    writeLog("抵达神庙，正在躲避守卫并搜索入口……", "system");
    const temple = await TreasureMap.searchTemple(bridge);
    writeLog(temple, "success");

    setStage(4);
    writeLog("机关石门被锁住，开始破解图案……", "system");
    const puzzle = await TreasureMap.solvePuzzle();
    writeLog(puzzle, "success");

    setStage(5);
    writeLog("最后一步：打开宝箱……", "system");
    const treasure = await TreasureMap.openTreasureBox();
    writeLog(treasure, "success");

    progressText.textContent = "寻宝成功";
    stages.at(-1).classList.add("done");
    showToast("🎉 寻宝成功！");
  } catch (error) {
    writeLog(`任务失败：${error.message}`, "danger");
    progressText.textContent = "任务失败，可再次挑战";
    showToast("⚠️ 遇到危险，再试一次！");
  } finally {
    startBtn.disabled = false;
    startBtn.textContent = "再次寻宝";
  }
}

startBtn.addEventListener("click", findTreasureWithAsyncAwait);
