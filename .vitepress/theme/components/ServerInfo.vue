<template>
    <section class="container py-5 text-center text-white" id="get">
        <a data-bs-toggle="tooltip" data-bs-title="点击按钮以复制服务器 IP">
            <button class="btn btn-outline-light btn-lg mb-3 fs-2 fw-bold" type="button" onclick="copyToClipboard()"
                data-bs-toggle="modal" data-bs-target="#myModal">
                <i class="bi bi-browser-safari"></i><span id="ServerIP">play.mahoo12138.cn</span>
            </button>
        </a>

        <div class="placeholder-glow" id="ping-area">
            <p class="row mx-auto" style="max-width: 260px;">
                <span class="ping-info mx-1 px-2 placeholder col">
                    <i class="bi bi-hdd-network-fill">服务器状态</i>
                    <span id="status">unknown</span>
                </span>
                <span class="ping-info mx-1 px-2 placeholder col">
                    <i class="bi bi-people-fill">在线人数</i>
                    <span id="people">null</span>
                </span>
            </p>

            <p class="row my-0 mx-auto" style="max-width: 520px;">
                <span class="ping-info mx-1 px-2 placeholder col">
                    <i class="bi bi-check2"></i>
                    <span>正版验证开启</span>
                </span>
                <span class="ping-info mx-1 px-2 placeholder col">
                    <i class="bi bi-2-square"></i>
                    <span>当前周目 S2</span>
                </span>
                <span class="ping-info mx-1 px-2 placeholder col">
                    <i class="bi bi-controller"></i>
                    <span>游戏版本 </span>
                    <span id="game-version">1.20.1</span>
                </span>
            </p>
        </div>
    </section>
</template>


<style lang="scss" scoped>
.container {
    background-image: linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    padding-top: 3rem;
    padding-bottom: 3rem;
}
</style>