<template>
    <footer class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 pt-5 mt-5 border-top">
            <div class="col mb-3">
                <a href="#" class="d-flex align-items-center mb-3 text-decoration-none">
                    <img class="img-fluid footer-logo" src="/img/logo.png" alt="">
                </a>
                <h5 class="text-center">田园牧歌 我们的家园</h5>
            </div>

            <div class="col mb-3"></div>

            <div class="col mb-3">
                <h5>站点</h5>
                <ul class="nav flex-column">
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">主站</a>
                    </li>
                    <li class="nav-item mb-2"><a href="/wiki" class="nav-link p-0 text-body-secondary">Wiki</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">博物馆</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">卫星云图</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">服务状态</a></li>
                </ul>
            </div>

            <div class="col mb-3">
                <h5>联系我们</h5>
                <ul class="nav flex-column">
                    <li class="nav-item mb-2"><a href="//url.rxgzs.cn/tucao"
                            class="nav-link p-0 text-body-secondary">报告问题</a></li>
                    <li class="nav-item mb-2"><a href="https://github.com/Mahoo12138/mahoo-town"
                            class="nav-link p-0 text-body-secondary">Github</a></li>
                    <!-- <li class="nav-item mb-2"><a href="https://jq.qq.com/"
                            class="nav-link p-0 text-body-secondary">QQ群 xxxx</a></li> -->
                    <li class="nav-item mb-2"><a href="mailto:mahoo12138@qq.com"
                            class="nav-link p-0 text-body-secondary">电子邮箱</a></li>

                </ul>
            </div>

            <div class="col mb-3">
                <h5>关于我们</h5>
                <ul class="nav flex-column">

                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">工作机会</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">大事记</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-body-secondary">开放平台</a></li>
                    <li class="nav-item mb-2"><a href="https://blog.mahoo12138.cn"
                            class="nav-link p-0 text-body-secondary">Mahoo Blog</a></li>
                </ul>
            </div>
        </div>

        <div class="copyright text-center pb-5 text-body-secondary">
            <small>
                <p>
                    友情连接：
                    <a class="text-decoration-none text-reset" href="https://zh.minecraft.wiki/" target="_blank">
                        MC Wiki
                    </a>
                    &nbsp;
                    <a class="text-decoration-none text-reset" href="https://www.mcmod.cn/" target="_blank">
                        MC 百科
                    </a>
                    &nbsp;
                    <a class="text-decoration-none text-reset" href="https://www.mualliance.cn" target="_blank">
                        中国MC高校联盟
                    </a>
                </p>
                <p>
                    <a class="text-decoration-none text-reset" href="#" target="_blank">市民公约</a>
                    |
                    <a class="text-decoration-none text-reset" href="#" target="_blank">服务条款</a>
                    |
                    <a class="text-decoration-none text-reset" href="#" target="_blank">隐私政策</a> |
                    <a class="text-decoration-none text-reset" href="#" target="_blank">Mahoo12138</a>
                    <br>
                    Copyright © 2024~2025 <a class="text-decoration-none text-reset" href="https://mahoo12138.cn"
                        target="_blank">Mahoo12138</a> All rights reserved.
                    <br>
                    Operated by Mahoo12138.
                    <br>
                    <i class="bi bi-git"></i>Version: {{ VERSION }}
                </p>
            </small>
        </div>
    </footer>
</template>
<script lang="ts" setup>
const VERSION = "1.0.0"

</script>