#!/bin/bash
# Добавить эту строку в crontab для автоматического сохранения каждые 5 минут:
# */5 * * * * /home/rokket/Документы/3d-shop/3D-shop/auto_save.sh > /tmp/auto_save.log 2>&1

echo "Чтобы настроить автоматическое сохранение каждые 5 минут, выполните:"
echo "crontab -e"
echo "И добавьте строку:"
echo "*/5 * * * * /home/rokket/Документы/3d-shop/3D-shop/auto_save.sh > /tmp/auto_save.log 2>&1"